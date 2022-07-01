import { React, useState, useCallback, useRef, useEffect } from "react";
import { useBuildingStore, demolishOnGrid } from "./BuildingStore.js";
import { gridDimensions, gridSize, plotSize, ID } from "./GridData";
import { buildingTypes } from "./BuildingTypes.js";
import { generateUUID } from "three/src/math/MathUtils";
import { ethers } from "ethers";

const apiAddBuilding = async (id, [x0, y0], [x1, y1], type, orientation) => {
  const message = `Building ${type} in city ${id}, messageUUID:${generateUUID()}`;

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let signature;
  try {
    signature = await signer.signMessage(message);
  } catch (error) {
    return { ok: false, status: error.message };
  }
  const address = await signer.getAddress();

  let body = JSON.stringify({
    building: {
      start: { x: x0, y: y0 },
      end: { x: x1, y: y1 },
      orientation: orientation,
      type: type,
      level: 0,
    },
    signature: signature,
    message: message,
  });
  const response = await fetch(`http://localhost:8000/cities/${id}/build`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
  return response;
};

const apiRemoveBuilding = async (id, index, [x0, y0], [x1, y1], type, level, orientation) => {
  const message = `Removing ${type}, index:${index} in city ${id}, messageUUID:${generateUUID()}`;

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let signature;
  try {
    signature = await signer.signMessage(message);
    // console.log({message, signature});
  } catch (error) {
    return { ok: false, status: error.message };
  }
  const address = await signer.getAddress();

  let body = JSON.stringify({
    params: { id: id },
    index: index,
    building: {
      start: { x: x0, y: y0 },
      end: { x: x1, y: y1 },
      type: type,
      level: level,
      orientation: orientation,
    },
    signature: signature,
    message: message,
  });
  const response = await fetch(`http://localhost:8000/cities/${id}/remove`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
  return response;
};

function GridSquare(props) {
  const selectedBuilding = useBuildingStore((state) => state.selectedBuilding);
  let selectedBuildingType = selectedBuilding ? buildingTypes[selectedBuilding][0] : null; //checks if selectedBuilding is null
  const gridDimensions = props.gridDimensions;
  const gridSize = props.gridSize;
  const plotSize = props.plotSize;
  const ID = props.ID;
  const x = props.x;
  const y = props.y;
  const buildings = props.buildings;
  const [hovered, setHover] = useState(false);
  const grid = useBuildingStore((state) => state.grid);
  const addBuilding = useBuildingStore((state) => state.addBuilding);
  const demolishBuilding = useBuildingStore((state) => state.removeBuilding);
  const buildMode = useBuildingStore((state) => state.buildMode);
  const setHoveredXY = useBuildingStore((state) => state.setHoveredXY);
  const hoverObjectMove = useBuildingStore((state) => state.hoverObjectMove);
  const buildRotation = useBuildingStore((state) => state.buildRotation);

  async function build(x, y, grid, selectedBuildingType, buildRotation) {
    let endXY;
    let startXY;
    let buildable = true;
    if (selectedBuildingType === null) {
      buildable = false;
      console.log("no building type selected");
    } else {
      switch (buildRotation) {
        case 2:
          endXY = [x + selectedBuildingType.height - 1, y];
          startXY = [x, y - selectedBuildingType.width + 1];
          break;
        case 3:
          endXY = [x, y];
          startXY = [x - selectedBuildingType.width + 1, y - selectedBuildingType.height + 1];
          break;
        case 4:
          endXY = [x, y + selectedBuildingType.width - 1];
          startXY = [x - selectedBuildingType.height + 1, y];
          break;
        default: /// and 1
          endXY = [x + selectedBuildingType.width - 1, y + selectedBuildingType.height - 1];
          startXY = [x, y];
          break;
      }
      console.log(startXY);
      console.log(endXY);
      if (
        startXY[0] < 0 ||
        startXY[1] < 0 ||
        startXY[0] >= gridSize ||
        startXY[1] >= gridSize ||
        endXY[0] < 0 ||
        endXY[1] < 0 ||
        endXY[0] >= gridSize ||
        endXY[1] >= gridSize
      ) {
        buildable = false;
        console.log("error: trying to build out of bounds");
      } else {
        for (let i = startXY[0]; i < endXY[0]; i++) {
          for (let j = startXY[1]; j < endXY[1]; j++) {
            if (grid[i * gridSize + j] != null && grid[i * gridSize + j] != undefined) {
              buildable = false;
            }
          }
        }
      }
    }
    if (buildable) {
      ///////OVDE UMESTO apiAddBuilding treba da se doda na listu instrukcija
      ///takodje napraviti local updates za novac i tako to
      /// i provere za isto
      useBuildingStore.setState({ hoverObjectMove: false });
      let response = await apiAddBuilding(ID, startXY, endXY, selectedBuildingType.type, buildRotation);
      if (response.ok) {
        addBuilding(startXY, endXY, selectedBuildingType.type);
        useBuildingStore.setState({ hoverObjectMove: true });
      } else {
        alert("HTTP-Error: " + response.status);
        useBuildingStore.setState({ hoverObjectMove: true });
      }
    } else console.log("can't build");
  }
  const remove = async (x, y, grid, buildings) => {
    let notEmpty = true;
    if (grid[x * gridSize + y] === null || grid[x * gridSize + y] === undefined) notEmpty = false;
    if (notEmpty) {
      useBuildingStore.setState({ hoverObjectMove: false });
      let uuid = grid[x * gridSize + y];
      let index = buildings.findIndex((building) => building.uuid === uuid);
      ///////OVDE UMESTO apiRemoveBuilding treba da se doda na listu instrukcija
      ///takodje napraviti local updates za novac i tako to
      let response = await apiRemoveBuilding(
        ID,
        index,
        [buildings[index].start.x, buildings[index].start.y],
        [buildings[index].end.x, buildings[index].end.y],
        buildings[index].type,
        buildings[index].level,
        buildings[index].orientation
      );
      if (response.ok) {
        demolishBuilding(uuid);
        useBuildingStore.setState({ hoverObjectMove: true });
      } else {
        alert("HTTP-Error: " + response.status);
        useBuildingStore.setState({ hoverObjectMove: true });
      }
    } else console.log("this grid square is empty already");
  };

  function onClick(e) {
    e.stopPropagation();
    buildMode ? build(x, y, grid, selectedBuildingType, buildRotation) : remove(x, y, grid, buildings);
  }

  return (
    <mesh
      {...props}
      onPointerOver={(event) => {
        if (hoverObjectMove) {
          setHover(true), setHoveredXY(props.x, props.y);
        }
      }}
      onPointerOut={(event) => {
        setHover(false);
      }}
      onClick={onClick}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial
        attach="material"
        color={hovered ? (buildMode ? 0x88ff88 : 0xff8888) : "lightgray"}
        transparent
        opacity={props.built ? 0 : hovered ? 0.8 : 0.6}
      />
    </mesh>
  );
}

export default function Grid({ ID }) {
  const grid = useBuildingStore((state) => state.grid);
  const buildings = useBuildingStore((state) => state.buildings); //ovo je bitno jer se zbog ovoga refreshuje
  let position;
  let x;
  let y;
  return grid.map((element, index) => {
    x = Math.floor(index / gridSize);
    y = index % gridSize;
    position = [plotSize * x - (gridSize * plotSize) / 2 + plotSize / 2, 0, plotSize * y - (gridSize * plotSize) / 2 + plotSize / 2];
    return (
      <GridSquare
        buildings={buildings}
        gridSize={gridSize}
        ID={ID}
        gridDimensions={gridDimensions}
        plotSize={plotSize}
        key={index}
        position={position}
        scale={[plotSize * 0.9, 0.6, plotSize * 0.9]}
        x={x}
        y={y}
        built={element ? true : false}
      />
    );
  });
}
