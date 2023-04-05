import React from 'react'
import { useBuildingStore } from '../game/BuildingStore';

import { MapControls } from "@react-three/drei";

import { plotSize } from '../game/MapData';

import Buildings from '../game/Buildings/Buildings';
import WorldCanvas from '../game/WorldCanvas';
import Lights from '../game/Lights';
import Landscape from '../universal/city/Landscape';

import styles from './mergeLandscape.module.css';

const MergeCity = ({ first, city, dim }) => {

  if(!city) return null;

  const pos = useBuildingStore(state => first ? state.mergePos1 : state.mergePos2);
  const setPos = useBuildingStore(state => first ? state.setMergePos1 : state.setMergePos2);

  const move = (x, y) => {
    setPos({ x: pos.x + x, y: pos.y + y, r: pos.r });
  }

  const rotate = () => {
    setPos({ ...pos, r: (pos.rotate + 1) % 4 })
  }

  const overlayPosition = [
    (city.dimensions.x-1 + pos.x*2)/2*plotSize, 
    0, 
    (city.dimensions.y-1 + pos.y*2)/2*plotSize
  ];

  return (
    <>
      <Buildings id={city.id} data={city} prefixID={first?'city1':'city2'} offset={pos} />
      {/* <mesh position={overlayPosition} >
        <boxGeometry args={[ city.dimensions.x * plotSize, first?12:12.5, city.dimensions.y * plotSize ]} />
        <meshPhongMaterial transparent color={first?"blue":"red"} opacity={0.2} />
      </mesh> */}
    </>
  );

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
        <MapControls maxDistance={400} minDistance={75} enableDamping={false} />
        <Lights />
        <Landscape dimensions={dimensions} />

        {/* CITIES */}
        <MergeCity city={city1} dim={d} first />
        <MergeCity city={city2} dim={d} />
      </WorldCanvas>
    </div>
  )
}

export default MergeLandscape