import React from 'react'
import { useEffect } from 'react';

import { generateUUID } from 'three/src/math/MathUtils';

import { gridSize, plotSize, Scale } from "../MapData";
import { useBuildingStore } from '../BuildingStore';
import { buildingTypes } from '../modelComponents/BuildingTypes';

const buildingGridElement = (x, y, onClick) => {
  const gridElement = useBuildingStore(state => state[`${x}_${y}`]);
  const changeCoordinate = useBuildingStore(state => state.changeCoordinate);
  const { building, status } = gridElement || {};

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const statusFunctions = {
    building: async () => {
      let time = 0;
      while(time < 1000) {

        console.log('building...');

        await delay(100);
        time += 100;
      }
      changeCoordinate(x, y, { ...gridElement, status: 'built' });
    },
    built: async () => {
      console.log('built');
    },
    removing: async () => {
      console.log('removing');
    },
    upgrading: async () => {
      console.log('upgrading');
    }
  }

  useEffect(() => {

    if(!status) return;

    statusFunctions[status]();

  }, [ status ]);

  // check if there is a building with x and y start coordinates, if not, null is returned
  if(!building) return null;

  // calculating the canvas position and rotation of the building
  let type = building.type;
  const posX = (building.start.x + building.end.x) / 2;
  const posY = (building.start.y + building.end.y) / 2;
  const position = [
    plotSize * posX - (gridSize * plotSize) / 2 + plotSize / 2,
    0,
    plotSize * posY - (gridSize * plotSize) / 2 + plotSize / 2,
  ];
  const rotation = (Math.PI / 2) * (building.orientation - 1);

  let key = generateUUID();

  return buildingTypes[type](
    { 
      scale: Scale, 
      key: key, 
      uuid: building.uuid, 
      position: position, 
      rotation: [0, rotation, 0] 
    },
    { ...building, plotSize, gridSize, rotation, key },
    (ref) => onClick(building, ref)
  );
}

const NormalBuildings = ({ onClick }) => {
  let buildingList = [];
  for(let x = 0; x < gridSize; x++) {
    for(let y = 0; y < gridSize; y++) { 
      buildingList.push(buildingGridElement(x, y, onClick))
    }
  }
  return buildingList;
}

// #region old version

const NormalBuildingsOld = ({ onClick }) => {

  const buildings = useBuildingStore(state => state.buildings);

  if(!buildings) return <></>;
  
  return buildings.map((building, index) => {
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

    // console.log(position);
    return buildingTypes[Type](
      { 
        scale: Scale, 
        key: key, 
        uuid: building.uuid, 
        position: position, 
        rotation: [0, rotation, 0] 
      },
      { ...building, plotSize, gridSize, rotation, key },
      (ref) => onClick(building, ref)
    );
  });
}

// #endregion

export default NormalBuildings