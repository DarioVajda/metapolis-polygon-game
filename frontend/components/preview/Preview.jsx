import React from 'react'

import { MapControls } from "@react-three/drei";

import styles from '../game/htmlContent/gameplay.module.css';

import HTMLContent from '../game/htmlContent/HTMLContent';
import WorldCanvas from '../game/WorldCanvas';
import Lights from '../game/Lights';
import Buildings from '../game/Buildings/Buildings';
import FloatingMenu from '../game/floatingMenu/FloatingMenu';
import Popup from '../game/popup/Popup';

import Landscape from '../universal/city/Landscape';
import { useBuildingStore } from '../game/BuildingStore';

const Preview = ({ id }) => {

  const { dimensions } = useBuildingStore(state => state.staticData);

  return (
    <div className={styles.wrapper}>
      <WorldCanvas position={[0, 250, 200]} diemnsions={dimensions} >

        {/* UTILS */}
        <MapControls maxDistance={400} minDistance={5} enableDamping={false} />
        <Lights />

        {/* STATIC CONTENT */}
        <Landscape />
        <Buildings id={id} showGrid />

        {/* DYNAMIC CONTENT */}
        <FloatingMenu preview />

      </WorldCanvas>
      <HTMLContent id={id} preview />
      <Popup />
    </div>
  )
}

export default Preview