import React, { useState, useEffect } from "react";
import { useBuildingStore } from "./BuildingStore.js";
import { gridDimensions, gridSize, plotSize, Scale, ID } from "./GridData";
import House from "./modelComponents/House";
import Factory from "./modelComponents/Factory";
import Building from "./modelComponents/Building";
import LongBuilding from "./modelComponents/Building3x1.js";
import { generateUUID } from "three/src/math/MathUtils";
import Store from "./modelComponents/Store.js";
import Office from "./modelComponents/Office.js";
import ParkSquare from "./modelComponents/ParkSquare.js";

export default function Buildings({ ID }) {
  const initializeBuildings = useBuildingStore((state) => state.initializeBuildings);
  const buildings = useBuildingStore((state) => state.buildings);

  async function getCityData(id) {
    let response = await fetch(`https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/cities/${id}/data`);
    if (response.ok) {
      let json = await response.json();
      initializeBuildings(json.buildings.map((building) => ({ ...building, uuid: generateUUID() })));
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }

  useEffect(() => {
    getCityData(ID);
  }, []);

  //CURRENTLY UUID GENERATION IS NOT USED ANYWHERE
  if (buildings.length > 0) {
    console.log(buildings);
    return buildings.map((building, index) => {
      // console.log(index+':'+building.type)
      let Type = building.type;
      const posX = (building.start.x + building.end.x) / 2;
      const posY = (building.start.y + building.end.y) / 2;
      const position = [
        plotSize * posX - (gridSize * plotSize) / 2 + plotSize / 2,
        0,
        plotSize * posY - (gridSize * plotSize) / 2 + plotSize / 2,
      ];
      const rotation = (Math.PI / 2) * (building.orientation - 1);

      let key = generateUUID();

      if (Type === "house") {
        return <House scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
      } else if (Type === "factory") {
        return <Factory scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
      } else if (Type === "store") {
        return <Store scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
      } else if (Type === "office") {
        return <Office scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
        /////////////////////////////////////////PARK IS TEMPORARY
      } else if (Type === "park") {
        let parkSquares = [];
        for (let i = building.start.x; i <= building.end.x; i++) {
          for (let j = building.start.y; j <= building.end.y; j++) {
            parkSquares.push(
              <ParkSquare
                scale={Scale}
                key={generateUUID()}
                position={[
                  plotSize * i - (gridSize * plotSize) / 2 + plotSize / 2,
                  0,
                  plotSize * j - (gridSize * plotSize) / 2 + plotSize / 2,
                ]}
                rotation={[0, rotation, 0]}
              />
            );
          }
        }
        return (
          <group key={key} uuid={building.uuid}>
            {parkSquares}
          </group>
        );
        /////////////////////////////////////////PARK IS TEMPORARY
      } else if (Type === "building") {
        if (
          Math.abs(building.start.x - building.end.x) + 1 === 2 ||
          Math.abs(building.start.y - building.end.y) + 1 === 2
        )
          return <Building scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
        else {
          return <LongBuilding scale={Scale} key={key} uuid={building.uuid} position={position} rotation={[0, rotation, 0]} />;
        }
      }

      //add more later
    });
  } else {
    return <></>;
  }
}

///// MOZDA SCALE DA SE RACUNA NA OSNOVU PLOTSIZE, OVAKO JE MALO GLUPO...
