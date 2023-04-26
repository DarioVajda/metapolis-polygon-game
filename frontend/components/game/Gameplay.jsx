import React from 'react'

import { MapControls } from "@react-three/drei";

import styles from './htmlContent/gameplay.module.css';

import HTMLContent from './htmlContent/HTMLContent';
import WorldCanvas from './WorldCanvas';
import Lights from './Lights';
import Buildings from './Buildings/Buildings';
import HoverObject from './HoverObject';
import FloatingMenu from './floatingMenu/FloatingMenu';
import Popup from './popup/Popup';

import Landscape from '../universal/city/Landscape';
import { useBuildingStore } from './BuildingStore';

const Gameplay = ({ ID }) => {

  const { dimensions } =  useBuildingStore(state => state.staticData);

  console.log(window.devicePixelRatio);

  return (
    <div className={styles.wrapper}>
      <WorldCanvas position={[0, 250, 200]} dimensions={dimensions} pixelRatio={window.devicePixelRatio} >

        {/* UTILS */}
        <MapControls maxDistance={400} minDistance={20} enableDamping={false} />
        <Lights />

        {/* STATIC CONTENT */}
        <Landscape />
        <Buildings id={ID} offset={{x:0,y:0,r:0}} showGrid />

        {/* DYNAMIC CONTENT */}
        <HoverObject />
        <FloatingMenu />

      </WorldCanvas>
      <HTMLContent id={ID} />
      <Popup />
    </div>
  )
}

export default Gameplay