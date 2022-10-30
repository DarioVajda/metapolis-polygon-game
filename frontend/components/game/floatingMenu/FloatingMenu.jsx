import React, { useState } from 'react'
import { useRef } from 'react';

import styles from './floatingMenu.module.css';

import { Html } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';

import { useBuildingStore } from '../BuildingStore';

import { menuDataComponents } from './menuDataComponents';
import { buildingMenuTypes } from './menuData';

const Buttons = ({ upgrading, setUpgrading, sell, upgrade }) => {

  if(upgrading === false) return (
    <>
      <button className={styles.upgradeButton} onClick={() => setUpgrading(true)}>
        Upgrade
      </button>
      <button className={styles.sellButton} onClick={() => sell()}>
        Sell
      </button>
    </>
  )
  else return (
    <>
      <button className={styles.confirmButton} onClick={() => upgrade} style={{ backgroundColor: 'blue' }}>
        Confirm
      </button>
      <button className={styles.cancelButton} onClick={() => setUpgrading(false)}>
        Cancel
      </button>
    </>
  )
}

const FloatingMenu = () => {

  const htmlRef = useRef();
  const [ distanceFactor, setDistanceFactor ] = useState(10);
  const [ upgrading, setUpgrading ] = useState(false);

  const floatingMenu = useBuildingStore(state => state.floatingMenu);

  // #region Zoom handling
  const camera = useThree(state => state.camera);
  const invalidate = useThree(state => state.invalidate);

  useFrame(() => {

    let x0 = camera.position.x - Math.cos(camera.rotation.z) * camera.position.y;
    let z0 = camera.position.z - Math.cos(camera.rotation.x) * camera.position.y;

    let newDistanceFactor = Math.sqrt((camera.position.x-x0)**2 + (camera.position.y+100)**2 + (camera.position.z-z0)**2)/8
    if(distanceFactor !== newDistanceFactor) {
      setDistanceFactor(newDistanceFactor);
      invalidate();
    }
  })
  // #endregion

  if(floatingMenu === null) return <></>;

  return (
    <group position={[ 0, 3, 0 ]}>
      {/* <ZoomHandler ref={htmlRef} /> */}
      <Html
        ref={htmlRef}
        transform
        sprite
        distanceFactor={distanceFactor}
        position={floatingMenu.position}
      >
        <div className={styles.wrapper}>
          <span className={styles.title}>
            Level {floatingMenu.building.level+1} {buildingMenuTypes[floatingMenu.building.type].name}
          </span>
          {/* {menuDataComponents['people']('building', 1, true)} */}
          {menuDataComponents['workplaces']('factory', 1, true)}
          {/* {menuDataComponents['boost']('gym', 1, true)} */}
          {menuDataComponents['decrease']('factory', 1, true)}
          <span className={styles.description}>
            {buildingMenuTypes[floatingMenu.building.type].description}
          </span>
          <div className={styles.buttons}>
            <Buttons upgrading={upgrading} setUpgrading={setUpgrading} upgrade={() => console.log('upgrade building')} sell={() => console.log('sell building')} />
          </div>
        </div>
      </Html>
    </group>
  )
}

export default FloatingMenu