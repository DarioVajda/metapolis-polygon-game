import React from 'react'
import { useBuildingStore } from '../game/BuildingStore'
import { plotSize } from '../game/MapData';

const Coordinates = ({ dimensions }) => {

  const setHover = useBuildingStore(state => state.setHover);
  const controlsEnabled = useBuildingStore(state => state.controlsEnabled);

  if(controlsEnabled) return null;

  const changeHover = (x, y) => {

    if(controlsEnabled) {
      console.log('controls are not enabled');
      return;
    }

    console.log('hovering', x, y);
    setHover(x, y);
  }

  console.log('rendering coordinates');

  // return null;
  return (
    <group>
    {
      Array(dimensions.x).fill(null).map((_, x) => (
        Array(dimensions.y).fill(null).map((_, y) => {
          // console.log(x, y);
          return (
            <group onPointerEnter={() => changeHover(x, y)}>
              <mesh position={[plotSize * x, -0.3, plotSize * y]} >
                <boxGeometry args={[ plotSize, 0.1, plotSize ]} />
                <meshPhongMaterial transparent color="red" opacity={0.2} />
              </mesh>
            </group>
          )
        })
      ))
    }
    </group>
  )
}

export default Coordinates