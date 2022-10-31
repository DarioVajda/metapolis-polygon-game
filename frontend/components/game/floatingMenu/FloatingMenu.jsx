import React, { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';

import styles from './floatingMenu.module.css';

import { Html } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';

import { useBuildingStore } from '../BuildingStore';

import { buildingStats } from '../../../../server/gameplay/building_stats';
import { menuDataComponents } from './menuDataComponents';
import { buildingMenuTypes } from './menuData';
import { formatNumber } from '../../utils/numFormat';

import ArrowIcon2 from '../../universal/icons/ArrowIcon2';
import XIcon from '../../universal/icons/XIcon';
import MoneyIcon from '../../universal/icons/MoneyIcon';

const Buttons = ({ status, setStatus, sell, upgrade, building }) => {

  const RETURN_PERCENTAGE = 0.5;
  let sellValue = RETURN_PERCENTAGE * buildingStats
    .get(building.type) // dobija se lista levela i podataka o levelima
    .slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
    .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno

  let upgradeValue = buildingStats.get(building.type)[building.level + 1].cost;

  if(building.type === 'building' || building.type === 'park') {
    let area = (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
    sellValue *= area;
    upgradeValue *= area;
  }

  if(status === 'upgrading') {
    return (
      <>
        <button className={styles.confirmButton} onClick={upgrade} style={{ backgroundColor: 'blue' }}>
          <span>
            Confirm
            <ArrowIcon2 />
          </span>
          <span>
            <MoneyIcon size={0.7} />
            {upgradeValue}
          </span>
        </button>
        <button className={styles.cancelButton} onClick={() => setStatus(null)}>
          Cancel
        </button>
      </>
    )
  }
  else if(status === 'selling') {
    return (
      <>
        <button className={styles.confirmButton} onClick={sell} style={{ backgroundColor: 'blue' }}>
          <span>
            Confirm
            <XIcon colorArg='var(--text)' />
          </span>
          <span>
            <MoneyIcon size={0.7} />
            {sellValue}
          </span>
        </button>
        <button className={styles.cancelButton} onClick={() => setStatus(null)}>
          Cancel
        </button>
      </>
    )
  }
  else {
    return (
      <>
        <button className={styles.upgradeButton} onClick={() => setStatus('upgrading')}>
          Upgrade
          <span>
            <MoneyIcon size={0.7} />
            {formatNumber(upgradeValue)}
          </span>
        </button>
        <button className={styles.sellButton} onClick={() => setStatus('selling')}>
          Sell
          <span>
            <MoneyIcon size={0.7} />
            {formatNumber(sellValue)}
          </span>
        </button>
      </>
    )
  }
}

const FloatingMenu = () => {

  const htmlRef = useRef();
  const [ distanceFactor, setDistanceFactor ] = useState(10);
  const [ status, setStatus ] = useState(null);

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
  });

  useEffect(() => {
    setStatus(null);
  }, floatingMenu);
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
          {/* {menuDataComponents['people']('building', 1, status==='upgrading')} */}
          {/* {menuDataComponents['boost']('gym', 1, status==='upgrading')} */}
          {menuDataComponents['workplaces']('factory', 1, status==='upgrading')}
          {menuDataComponents['decrease']('factory', 1, status==='upgrading')}
          <span className={styles.description}>
            {buildingMenuTypes[floatingMenu.building.type].description}
          </span>
          <div className={styles.buttons}>
            <Buttons 
              status={status} 
              building={floatingMenu.building} 
              setStatus={setStatus} 
              upgrade={() => console.log('upgrade building')} 
              sell={() => console.log('sell building')} 
            />
          </div>
        </div>
      </Html>
    </group>
  )
}

export default FloatingMenu