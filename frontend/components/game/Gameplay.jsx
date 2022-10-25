import React from 'react'

import { MapControls } from "@react-three/drei";

import styles from './htmlContent/gameplay.module.css';

import HTMLContent from './htmlContent/HTMLContent';
import WorldCanvas from './WorldCanvas';
import Lights from './Lights';
import Buildings from './Buildings/Buildings';
import HoverObject from './HoverObject';
import FloatingMenu from './FloatingMenu';

import Landscape from '../universal/city/Landscape';

const Gameplay = ({ ID }) => {
  return (
    <div className={styles.wrapper}>
      <WorldCanvas position={[0, 250, 200]} >

        {/* UTILS */}
        <MapControls maxDistance={400} minDistance={75} enableDamping={false} />
        <Lights />

        {/* STATIC CONTENT */}
        <Landscape />
        <Buildings id={ID} />

        {/* DYNAMIC CONTENT */}
        <HoverObject />
        <FloatingMenu />

      </WorldCanvas>
      <HTMLContent id={ID} />
    </div>
  )
}

export default Gameplay