import { generateUUID } from "three/src/math/MathUtils";

import House        from "./House";
import Factory      from "./Factory";
import Building     from "./Building";
import LongBuilding from "./Building3x1.js";
import Store        from "./Store.js";
import Office       from "./Office.js";
import ParkSquare   from "./ParkSquare.js";

import { Scale } from '../MapData';

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

export { buildingTypes };