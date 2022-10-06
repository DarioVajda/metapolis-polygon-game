import React from 'react'

import { generateUUID } from "three/src/math/MathUtils";

import House        from "../../game/modelComponents/House";
import Factory      from "../../game/modelComponents/Factory";
import Building     from "../../game/modelComponents/Building";
import LongBuilding from "../../game/modelComponents/Building3x1.js";
import Store        from "../../game/modelComponents/Store.js";
import Office       from "../../game/modelComponents/Office.js";
import ParkSquare   from "../../game/modelComponents/ParkSquare.js";

import { gridDimensions, gridSize, plotSize, Scale, ID } from "../../game/GridData";

const BuildingList = ({ data }) => {

  const buildingTypes = {
    house: (props, building) => <House {...props} />, 
    factory: (props, building) => <Factory {...props} />, 
    store: (props, building) => <Store {...props} />, 
    office: (props, building) => <Office {...props} />, 
    park: (props, building) => {
      let parkSquares = [];
      let { plotSize, gridSize, rotation, key } = building;
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
    },
    building: (props, building) => {
      if (
        Math.abs(building.start.x - building.end.x) + 1 === 2 ||
        Math.abs(building.start.y - building.end.y) + 1 === 2
      ) {
        return <Building {...props} />;
      }
      else {
        return <LongBuilding {...props} />;
      }
    }
  }

  if(!data) return <></>;

  // console.log(data)
  return data.buildings.map((building, index) => {
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

export default BuildingList