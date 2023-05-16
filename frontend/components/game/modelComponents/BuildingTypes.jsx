import { generateUUID } from "three/src/math/MathUtils";

import House        from "./House/House";
import Factory      from "./Factory/Factory";
import Building     from "./Building/Building";
import Building3x1  from "./Building3x1/Building3x1";
import Store        from "./Store/Store";
import Office       from "./Office/Office";
import ParkSquare   from "./ParkSquare";
import Park         from './Park/Park';

import Statue       from "./Statue/Statue";
import Fountain     from "./Fountain/Fountain"; 

import BuildingWrapper from "./BuildingWrapper";

import { Scale } from '../MapData';

const buildingTypes = {
  house: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <House {...props} level={building.level} />
    </BuildingWrapper>
  ), 
  factory: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Factory {...props} level={building.level} />
    </BuildingWrapper>
  ), 
  store: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Store {...props} level={building.level} />
    </BuildingWrapper>
  ), 
  office: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Office {...props} level={building.level} />
    </BuildingWrapper>
  ), 
  park: (props, building, onClick) => {
    return (
      <BuildingWrapper key={generateUUID()} onClick={onClick}>
        <Park
          {...props}
          level={0}
          dimensions={{x: building.end.x - building.start.x + 1, y: building.end.y - building.start.y + 1 }} 
        />
      </BuildingWrapper>
    )
    return (
      <BuildingWrapper key={generateUUID()} onClick={onClick}>
        <ParkSquare 
          {...props} 
          level={building.level} 
          scale={[Scale*(building.end.x-building.start.x+1), Scale, Scale*(building.end.y-building.start.y+1)]} 
        />
      </BuildingWrapper>
    )
    let parkSquares = [];
    let { plotSize, dimensions, rotation, key } = building;
    for (let i = building.start.x; i <= building.end.x; i++) {
      for (let j = building.start.y; j <= building.end.y; j++) {
        parkSquares.push(
          <ParkSquare
            scale={Scale}
            key={generateUUID()}
            position={[
              plotSize * i - (dimensions.x * plotSize) / 2 + plotSize / 2,
              0,
              plotSize * j - (dimensions.y * plotSize) / 2 + plotSize / 2,
            ]}
            rotation={[0, rotation, 0]}
            level={building.level}
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
          <Building {...props} level={building.level} />
        </BuildingWrapper>
      );
    }
    else {
      return (
        <BuildingWrapper key={generateUUID()} onClick={onClick}>
          <Building3x1  {...props} level={building.level} />
        </BuildingWrapper>
      );
    }
  }
}


// const buildingTypes = {
//   house: (props, building, onClick) => (
//     <BuildingWrapper key={generateUUID()} onClick={onClick}>
//       <Statue {...props} level={building.level} />
//     </BuildingWrapper>
//   ), 
//   factory: (props, building, onClick) => (
//     <BuildingWrapper key={generateUUID()} onClick={onClick}>
//       <Statue {...props} level={building.level} />
//     </BuildingWrapper>
//   ), 
//   store: (props, building, onClick) => (
//     <BuildingWrapper key={generateUUID()} onClick={onClick}>
//       <Statue {...props} level={building.level} />
//     </BuildingWrapper>
//   ), 
//   office: (props, building, onClick) => (
//     <BuildingWrapper key={generateUUID()} onClick={onClick}>
//       <Statue {...props} level={building.level} />
//     </BuildingWrapper>
//   ), 
//   park: (props, building, onClick) => {
//     return (
//       <BuildingWrapper key={generateUUID()} onClick={onClick}>
//         <Statue {...props} level={building.level} />
//       </BuildingWrapper>
//     )
//   },
//   building: (props, building, onClick) => {
//     return (
//       <BuildingWrapper key={generateUUID()} onClick={onClick}>
//         <Statue {...props} level={building.level} />
//       </BuildingWrapper>
//     )
//   }
// }

const specialBuildingTypes = {
  statue: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Statue {...props} level={building.level} />
    </BuildingWrapper>
  ),
  fountain: (props, building, onClick) => (
    <BuildingWrapper key={generateUUID()} onClick={onClick}>
      <Fountain {...props} level={building.level} />
    </BuildingWrapper>
  )
}

export { buildingTypes, specialBuildingTypes };