import React from 'react'
import { useRef } from 'react'

import { buildingTypes, specialBuildingTypes } from './modelComponents/BuildingTypes'
import { gridSize, plotSize, Scale } from "./MapData";
import { useFrame, useThree } from '@react-three/fiber';
import { useBuildingStore } from './BuildingStore';
import { useEffect } from 'react';

import { calculateCoordinates } from '../../../server/gameplay/coordinates';

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

const HoverObject = () => {

  const ref = useRef();
  const { invalidate } = useThree();
  
  const selectedBuildingType = useBuildingStore(state => state.selectedBuildingType);
  // const setSelectedBuildingType = useBuildingStore(state => state.setSelectedBuildingType);
  const hoverCurr = useBuildingStore(state => state.hoverCurr);
  const rotationIndex = useBuildingStore(state => state.rotationIndex);
  const incrementRotationIndex = useBuildingStore(state => state.incrementRotationIndex);
  const resetRotationIndex = useBuildingStore(state => state.resetRotationIndex);

  // #region key event listeners

  const buildings = useBuildingStore(state => state.buildings);
  const specialBuildings = useBuildingStore(state => state.specialBuildings);

  const overlaps = (d) => {
    if(selectedBuildingType.special === null) return false;
    let dimensions = selectedBuildingType.dimensions;
    let { start, end } = calculateCoordinates(dimensions, (rotationIndex+d)%4, { x: hoverCurr.x, y: hoverCurr.y });
    
    if(
      start.x < 0 || 
      start.y < 0 || 
      end.x > gridSize-1 || 
      end.y > gridSize-1
    ) {
      return true;
    }
    let r = false;
    [ ...buildings, ...specialBuildings ].forEach((element) => {
      if(!(
        start.x         > element.end.x ||
        element.start.x > end.x         ||
        start.y         > element.end.y ||
        element.start.y > end.y
      )) {
        r = true;
      }
    });
    return r;
  }

  const keypressed = useRef(null);

  const keydown = ({ key }) => {
    if(keypressed.current !== null && keypressed.current.toLowerCase() === key.toLowerCase()) return;
    keypressed.current = key.toLowerCase();

    if(selectedBuildingType.special === null) return;

    if(key.toLowerCase() === 'r') {
      // if(!overlaps(1) || true) { // ovo treba da se koristi ako zelis da se iskljuci zabrana rotiranja
      if(!overlaps(1)) {
        incrementRotationIndex(1);
      }
      else if(!overlaps(2)) {
        incrementRotationIndex(2);
      }
      else if(!overlaps(3)) {
        incrementRotationIndex(3);
      }
      else if(!overlaps(4)) {
        incrementRotationIndex(4);
      }
    }
  }

  const keyup = (event) => {
    keypressed.current = null;
  }

  useEventListener("keydown", keydown);
  useEventListener("keyup", keyup);

  // #endregion

  useFrame(() => {
    if(!selectedBuildingType || !ref.current) {
      return;
    }
    
    // #region movement
    let pos = {
      x: plotSize * hoverCurr.x,
      y: plotSize * hoverCurr.y
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
      ref.current.rotation.y = ref.current.rotation.y + dr * 0.25 + 0.01;
      invalidate();
    }
    // else if(Math.abs(targetRotation - 2 * Math.PI) < 0.01 && rotationIndex % 4 === 0) {
    // else if(Math.abs(Math.round(targetRotation / (2 * Math.PI)) - targetRotation / (2 * Math.PI)) < 0.01 && rotationIndex % 4 === 0) {
    //   ref.current.rotation.y = 0;
    //   resetRotationIndex();
    // }
    // console.log({targetRotation, dr, rotationIndex})
    // #endregion
  })

  if(selectedBuildingType.special === null) return <></>;

  invalidate();
  return (
    <group ref={ref} rotation={[ 0, 0, 0 ]} position={[0, 0, 0]} >
      {
        (selectedBuildingType.special?specialBuildingTypes:buildingTypes)[selectedBuildingType.type](
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
            end: { x: selectedBuildingType.dimensions[0], y: selectedBuildingType.dimensions[1] },
            level: 0
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