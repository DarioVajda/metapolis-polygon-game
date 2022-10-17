import React from 'react'

import { generateUUID } from 'three/src/math/MathUtils';

import { gridSize, plotSize, Scale } from "../MapData";
import { useBuildingStore } from '../BuildingStore';
import { buildingTypes } from '../modelComponents/BuildingTypes';

const NormalBuildings = () => {

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
      { ...building, plotSize, gridSize, rotation, key }
    );
  });
}

export default NormalBuildings