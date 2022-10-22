import React from 'react'
import { useRef } from 'react'

import { buildingTypes } from './modelComponents/BuildingTypes'
import { gridSize, plotSize, Scale } from "./MapData";
import { useFrame, useThree } from '@react-three/fiber';
import { useBuildingStore } from './BuildingStore';
import { useEffect } from 'react';

const HoverObject = () => {

  const ref = useRef();
  const { invalidate } = useThree();
  
  const selectedBuildingType = useBuildingStore(state => state.selectedBuildingType);
  // const setSelectedBuildingType = useBuildingStore(state => state.setSelectedBuildingType);
  const hoverCurr = useBuildingStore(state => state.hoverCurr);
  const rotationIndex = useBuildingStore(state => state.rotationIndex);
  const resetRotationIndex = useBuildingStore(state => state.resetRotationIndex);


  useFrame(() => {
    if(!selectedBuildingType || !ref.current) {
      return;
    }
    
    // #region movement
    let pos = {
      x: plotSize * hoverCurr.x - (gridSize * plotSize) / 2 + plotSize / 2,
      y: plotSize * hoverCurr.y - (gridSize * plotSize) / 2 + plotSize / 2
    };
    let d = {
      x: pos.x - ref.current.position.x,
      z: pos.y - ref.current.position.z
    }
    if(!(Math.abs(d.x) < 0.1 && Math.abs(d.z) < 0.1)) {  
      ref.current.position.x = ref.current.position.x + d.x * 0.25;
      ref.current.position.z = ref.current.position.z + d.z * 0.25;
      invalidate();
    }
    // #endregion

    // #region rotation
    let targetRotation = (rotationIndex) * (Math.PI / 2);
    let dr = targetRotation - ref.current.rotation.y;
    if(Math.abs(dr) > 0.01 ) {
      console.log({ targetRotation, dr})
      ref.current.rotation.y = ref.current.rotation.y + dr * 0.25;
      invalidate();
    }
    else if(Math.abs(targetRotation - 2 * Math.PI) < 0.01) {
      ref.current.rotation.y = 0;
      resetRotationIndex();
      invalidate();
    }
    // #endregion
  })

  if(selectedBuildingType.special === null) return <></>;

  invalidate();
  console.log(rotationIndex);
  return (
    <group ref={ref} rotation={[ 0, 0, 0 ]} position={[0, 0, 0]} >
      {
        buildingTypes[selectedBuildingType.type](
          {
            scale: Scale, 
            position: [
              (selectedBuildingType.dimensions[0] * plotSize - plotSize) / 2,
              0,
              (selectedBuildingType.dimensions[1] * plotSize - plotSize) / 2
            ], 
            rotation: [ 0, 0, 0 ] 
          }, 
          {
            start: { x: 1, y: 1 },
            end: { x: selectedBuildingType.dimensions[0], y: selectedBuildingType.dimensions[1] }
          }
        )
      }
    </group>
  )

  // return <mesh ref={ref} position={[0, 0, 0]}>
  //   <boxGeometry args={[5, 1, 5]} />
  //   <meshStandardMaterial color={"blue"} />
  // </mesh>
}

export default HoverObject