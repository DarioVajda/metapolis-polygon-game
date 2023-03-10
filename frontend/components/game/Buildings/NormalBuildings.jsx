import React from 'react'
import { useEffect } from 'react';

import { generateUUID } from 'three/src/math/MathUtils';

import { gridSize, plotSize, Scale } from "../MapData";
import { useBuildingStore } from '../BuildingStore';
import { buildingTypes } from '../modelComponents/BuildingTypes';
import { useThree } from '@react-three/fiber';

const buildingGridElement = (x, y, onClick, prefix, offset, dimensions) => {

  const gridElement = useBuildingStore(state => state[`${prefix?prefix:''}n_${x}_${y}`]);
  const changeCoordinate = useBuildingStore(state => state.changeCoordinate);
  const { building, status } = gridElement || {};

  const { invalidate } = useThree();

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const statusFunctions = {
    building: async () => {
      let time = 0;
      while(time < 1000) {

        // console.log('building...');
        invalidate();

        await delay(30);
        time += 30;
      }
      changeCoordinate(x, y, { ...gridElement, status: 'built' }, false);
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
      changeCoordinate(x, y, undefined, false);
    },
    upgrading: async () => {
      console.log('upgrading');
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
  const posX = (offset !== undefined ? offset.x : 0) + (building.start.x + building.end.x) / 2;
  const posY = (offset !== undefined ? offset.y : 0) + (building.start.y + building.end.y) / 2;
  const position = [
    plotSize * posX - (dimensions.x * plotSize) / 2 + plotSize / 2,
    0,
    plotSize * posY - (dimensions.y * plotSize) / 2 + plotSize / 2,
  ];
  const rotation = (Math.PI / 2) * (building.orientation - 1);

  let key = generateUUID();

  return buildingTypes[type](
    { 
      scale: Scale, 
      key: key, 
      uuid: building.uuid, 
      position: position, 
      rotation: [0, rotation, 0],
      status: gridElement.status
    },
    { ...building, plotSize, dimensions, rotation, key },
    (ref) => onClick(building, ref)
  );
}

const NormalBuildings = ({ onClick, prefix, offset }) => {

  const { dimensions } = useBuildingStore(state => state.staticData);

  let buildingList = [];
  for(let x = 0; x < dimensions.x; x++) {
    for(let y = 0; y < dimensions.y; y++) { 
      buildingList.push(buildingGridElement(x, y, onClick, prefix, offset, dimensions))
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