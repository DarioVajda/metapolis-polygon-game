import React from 'react'
import { useEffect } from 'react';

import { generateUUID } from 'three/src/math/MathUtils';

import { gridSize, plotSize, Scale } from "../MapData";
import { useBuildingStore } from '../BuildingStore';
import { specialBuildingTypes } from '../modelComponents/BuildingTypes';

const buildingGridElement = (x, y, onClick) => {
  const gridElement = useBuildingStore(state => state[`s_${x}_${y}`]);
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
      changeCoordinate(x, y, { ...gridElement, status: 'built' }, true);
    },
    built: async () => {
      console.log('built');
    },
    removing: async () => {
      let time = 0;
      while(time < 1000) {

        console.log('removing...');

        await delay(100);
        time += 100;
      }
      console.log('removed');
      changeCoordinate(x, y, undefined, true);
    },
    rotating: async () => {
      console.log('rotating');
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

  return specialBuildingTypes[type](
    { 
      scale: 100, 
      key: key, 
      uuid: generateUUID(), 
      position: position, 
      rotation: [0, rotation, 0] 
    },
    { ...building, plotSize, gridSize, rotation, key },
    (ref) => onClick(building, ref)
  );
}

const SpecialBuildings = ({ onClick }) => {
  let specialBuildingList = [];
  for(let x = 0; x < gridSize; x++) {
    for(let y = 0; y < gridSize; y++) { 
      specialBuildingList.push(buildingGridElement(x, y, onClick))
    }
  }
  return specialBuildingList;
}

export default SpecialBuildings