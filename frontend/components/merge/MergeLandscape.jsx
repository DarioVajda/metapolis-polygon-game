import React, { useEffect, useState } from 'react'
import { useBuildingStore } from '../game/BuildingStore';

import { MapControls } from "@react-three/drei";

import { plotSize } from '../game/MapData';

import Buildings from '../game/Buildings/Buildings';
import WorldCanvas from '../game/WorldCanvas';
import Lights from '../game/Lights';
import Landscape from '../universal/city/Landscape';
import Coordinates from './Coordinates';

import styles from './mergeLandscape.module.css';

const MergeCity = ({ first, city, dim }) => {

  const selectedCity = useBuildingStore(state => state.selectedCity);
  const selected = selectedCity === first;

  const setControlsEnabled = useBuildingStore(state => state.setControlsEnabled);
  const hoverCurr = useBuildingStore(state => state.hoverCurr);
  const [ initialPosition, setInitialPosition ] = useState({ x: 0, y: 0 });
  const [ moving, setMoving ] = useState(false);
  
  const pos = useBuildingStore(state => first ? state.mergePos1 : state.mergePos2);
  const setPos = useBuildingStore(state => first ? state.setMergePos1 : state.setMergePos2);
  
  console.log(hoverCurr, first?'first':'second');

  const move = (x, y) => {
    setPos({ x: pos.x + x, y: pos.y + y, r: pos.r });
  }
  
  const rotate = () => {
    setPos({ ...pos, r: (pos.rotate + 1) % 4 })
  }

  const onMouseDown = () => {
    if(first) console.log('first down');
    else console.log('second down');

    // disabling mouse controls in the world
    setControlsEnabled(false);
   
    // setting the initial position of the mouse at the beginning of the movement
    setInitialPosition(hoverCurr);

    // indicating that the movement began
    setMoving(true);
  }
  
  const onMouseUp = () => {
    if(first) console.log('first up');
    else console.log('second up');

    // enabling mouse controls in the world
    setControlsEnabled(true);
    
    // indicating that the movement ended
    setMoving(false);
  }

  useEffect(() => {
    if(moving === false) return;
    
    setPos({
      x: pos.x + (hoverCurr.x - initialPosition.x),
      y: pos.y + (hoverCurr.y - initialPosition.y),
    })
    setInitialPosition(hoverCurr);
  }, [ hoverCurr ]);
  
  if(!city) return null;
  
  const overlayPosition = [
    (city.dimensions.x-1 + pos.x*2)/2*plotSize, 
    selected?-0.1:-0.15, 
    (city.dimensions.y-1 + pos.y*2)/2*plotSize
  ];
  
  return (
    <>
      {/* City Buildings */}
      <Buildings id={city.id} data={city} prefixID={first?'city1':'city2'} offset={pos} />

      {/* City Background */}
      <group onPointerDown={onMouseDown} onPointerUp={onMouseUp}>
        <mesh position={overlayPosition} >
          <boxGeometry args={[ city.dimensions.x * plotSize, 0.001, city.dimensions.y * plotSize ]} />
          <meshPhongMaterial transparent color={first?"blue":"green"} opacity={0.18} />
        </mesh>
      </group>
    </>
  );

}

const Controls = () => {
  const controlsEnabled = useBuildingStore(state => state.controlsEnabled);
  return (
    // <MapControls maxDistance={400} minDistance={50} enableDamping={false} enabled={controlsEnabled||true} />
    <MapControls maxDistance={400} minDistance={50} enableDamping={false} enabled={controlsEnabled} />
  )
}

const MergeLandscape = () => {

  const city1 = useBuildingStore(state => state.mergeCity1);
  const city2 = useBuildingStore(state => state.mergeCity2);

  let d = !city1 || !city2 ? 20 : Math.max(city1.dimensions.x, city1.dimensions.y) + Math.max(city2.dimensions.x, city2.dimensions.y);
  console.log({d});
  let dimensions = { x: d, y: d };

  return (
    <div className={styles.wrapper}>
      <WorldCanvas position={[0, 250, 200]} dimensions={dimensions}>

        {/* UTILS */}
        <Controls />
        <Lights />
        <Landscape dimensions={dimensions} />
        <Coordinates dimensions={dimensions} />

        {/* CITIES */}
        <MergeCity city={city1} dim={d} first />
        <MergeCity city={city2} dim={d} />
      </WorldCanvas>
    </div>
  )
}

export default MergeLandscape