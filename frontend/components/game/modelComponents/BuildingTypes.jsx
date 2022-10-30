import { generateUUID } from "three/src/math/MathUtils";

import House        from "./House";
import Factory      from "./Factory";
import Building     from "./Building";
import LongBuilding from "./Building3x1.js";
import Store        from "./Store.js";
import Office       from "./Office.js";
import ParkSquare   from "./ParkSquare.js";

import BuildingWrapper from "./BuildingWrapper";

import { Scale } from '../MapData';

const buildingTypes = {
  house: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <House {...props} />
    </BuildingWrapper>
  ), 
  factory: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Factory {...props} />
    </BuildingWrapper>
  ), 
  store: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Store {...props} />
    </BuildingWrapper>
  ), 
  office: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Office {...props} />
    </BuildingWrapper>
  ), 
  park: (props, building, onClick) => {
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
      <BuildingWrapper key={generateUUID()} onClick={onClick}>
        <group key={key} uuid={false&&building.uuid}>
          {parkSquares}
        </group>
      </BuildingWrapper>
    );
  },
  building: (props, building, onClick) => {
    if (
      building.end.x - building.start.x === 1 &&
      building.end.y - building.start.y === 1
    ) {
      return (
        <BuildingWrapper key={generateUUID()} onClick={onClick}>
          <Building {...props} />
        </BuildingWrapper>
      );
    }
    else {
      return (
        <BuildingWrapper key={generateUUID()} onClick={onClick}>
          <LongBuilding {...props} />
        </BuildingWrapper>
      );
    }
  }
}

export { buildingTypes };