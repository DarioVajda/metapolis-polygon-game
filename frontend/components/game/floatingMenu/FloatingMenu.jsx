import React, { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';

import styles from './floatingMenu.module.css';

import { Html } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';

import { useBuildingStore } from '../BuildingStore';

import { buildingStats, specialPrices } from '../../../../server/gameplay/building_stats';
import { menuDataComponents } from './menuDataComponents';
import { buildingMenuTypes } from './menuData';
import { formatNumber } from '../../utils/numFormat';
import { buildingEffectMap } from '../../../../server/gameplay/map';
// import { calculateIncome } from '../../../../server/gameplay/income';

import ArrowIcon2 from '../../universal/icons/ArrowIcon2';
import XIcon from '../../universal/icons/XIcon';
import MoneyIcon from '../../universal/icons/MoneyIcon';
import RotateIcon from '../../universal/icons/RotateIcon';

const Buttons = ({ status, setStatus, sell, upgrade, rotate, building }) => {

  const instructions = useBuildingStore(state => state.instructions);
  const specialTypeData = useBuildingStore(state => state[`type_${building.type}`]);

  let stats = buildingStats.get(building.type);

  // console.log(building);
  let RETURN_PERCENTAGE = building.id !== undefined ? 0.5 : 1;
  let [ sellValue, setSellValue ] = useState(0);
  let [ upgradeValue, setUpgradeValue ] = useState(0);
  
  useEffect(() => {
    // calculating upgradeValue and sellValue for normal buildings
    if(building.level !== undefined) {
      let _sellValue = stats
        ?.slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
        .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno

      let deltaLevel = 0;
      instructions.forEach(element => {
        if(
          element.instruction === 'upgrade' && 
          JSON.stringify(building) === JSON.stringify({...element.body.building, orientation: building.orientation, level: building.level}) 
        ) {
          // console.log(element);
          deltaLevel = element.body.deltaLevel;
        }
      });

      let unsavedSellValue = stats
        ?.slice(0, building.level - deltaLevel + 1)
        .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih levela zajedno koje je gradjevina imala pre ikakvih lokalnih promena

      // console.log({deltaLevel, sellValue, unsavedSellValue});
      _sellValue -= unsavedSellValue * (1 - RETURN_PERCENTAGE);

      let _upgradeValue = stats && stats[building.level + 1] ? stats[building.level + 1].cost : 0;

      if((building.type === 'building' || building.type === 'park') && _upgradeValue > 0) {
        let area = (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
        _sellValue *= area;
        _upgradeValue *= area;
      }
      console.log('normal building', building);

      setSellValue(_sellValue);
      setUpgradeValue(_upgradeValue);
    }
    else {
      let _sellValue;
      if(specialTypeData.soldOut === false) {
        _sellValue = specialPrices.get(building.type) * RETURN_PERCENTAGE;
      }
      else {
        let highestOffer = specialTypeData.offers.reduce((prev, curr) => curr.value > prev.value ? curr : prev, { value: 0 });
        _sellValue = highestOffer.value;
      }
      console.log('special building', building);
      
      setSellValue(_sellValue);
    }
  }, [building])
  
  // TODO - obavezno obratiti paznju na ovo (brisanje novih gradjevina):
  // treba da se proveri da li gradjevina sadrzi id, ako sadrzi onda to znaci da gradjevina vec postoji u gradu i da je sacuvana, a ako ne postoji onda moze da se proda po punoj ceni sto bi u sustini ponistilo gradjenje u igrici jer to jos nije sacuvano, ako se u tom slucaju obrise gradjevina onda treba da se skloni ta build instrukcija sa liste umesto da se doda remove instrukcija
  
  if(status === 'upgrading') {
    return (
      <>
        <button className={styles.confirmButton} onClick={() => upgrade(upgradeValue)} style={{ backgroundColor: 'blue' }}>
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
        <button className={styles.confirmButton} onClick={() => sell(sellValue, specialTypeData?.soldOut === true)} style={{ backgroundColor: 'blue' }}>
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
        {
          building.level !== undefined && stats[building.level + 1] !== undefined && (
            <button className={styles.upgradeButton} onClick={() => setStatus('upgrading')}>
              Upgrade
              <span>
                <MoneyIcon size={0.7} />
                {formatNumber(upgradeValue)}
              </span>
            </button>
          )
        }
        <button className={styles.sellButton} onClick={() => setStatus('selling')}>
          Sell
          <span>
            <MoneyIcon size={0.7} />
            {formatNumber(sellValue)}
          </span>
        </button>
        <button className={styles.rotateButton} onClick={rotate}>
          Rotate
          <RotateIcon />
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
  const setFloatingMenu = useBuildingStore(state => state.setFloatingMenu);
  const dynamicData = useBuildingStore(state => state.dynamicData);
  const buildings = useBuildingStore(state => state.buildings);
  const instructions = useBuildingStore(state => state.instructions);
  
  const upgradeBuilding = useBuildingStore(state => state.upgradeBuilding);
  const removeBuilding = useBuildingStore(state => state.removeBuilding);
  const removeSpecialBuilding = useBuildingStore(state => state.removeSpecialBuilding);
  const rotateBuilding = useBuildingStore(state => state.rotateBuilding);
  const rotateSpecialBuilding = useBuildingStore(state => state.rotateSpecialBuilding);
  const calculateIncome = useBuildingStore(state => state.calculateIncome);

  const showProductivityMap = useBuildingStore(state => state.showProductivityMap);
  const toggleProductivityMap = useBuildingStore(state => state.toggleProductivityMap);
  const map = useRef();
  const showingProductivityMap = useRef(false);

  useEffect(() => {
    if(floatingMenu === null) {
      map.current = null;
      // showingProductivityMap.current = false;
      toggleProductivityMap(showProductivityMap === true);
    }
    else {
      // showingProductivityMap.current = true;
      // if(typeof showProductivityMap !== 'boolean') {
      if(showingProductivityMap.current) {
        map.current = buildingEffectMap(floatingMenu.building);
        toggleProductivityMap(map.current);
      }
      else {
        map.current = buildingEffectMap(floatingMenu.building);
      }
    }
    setStatus(null);
  }, [ floatingMenu ]);
  useEffect(() => {
    if(showProductivityMap === true) {
      showingProductivityMap.current = false;
    }
  }, [ showProductivityMap ])

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

  // #endregion

  // #region functions

  const upgradeFunc = (price) => {
    upgradeBuilding(floatingMenu.building, price);
    if(price > dynamicData.money) return;
    
    setFloatingMenu({ ...floatingMenu, building: { ...floatingMenu.building, level: floatingMenu.building.level + 1 } });
    setStatus(null);
    calculateIncome();
  }

  const sellFunc = (moneyValue, throughOffer) => {
    if(floatingMenu.building.level === undefined) {
      removeSpecialBuilding(floatingMenu.building, moneyValue, throughOffer);
    }
    else {
      removeBuilding(floatingMenu.building, moneyValue);
    }

    setFloatingMenu(null);
    setStatus(null);
    calculateIncome();
  }

  const rotateFunc = () => {
    let d = 1;
    let { start, end } = floatingMenu.building;
    if(end.x - start.x !== end.y - start.y) {
      d = 2;
    }
    // console.log(d);

    setFloatingMenu({ ...floatingMenu, building: { ...floatingMenu.building, orientation: (floatingMenu.building.orientation + d)%4 } })
    
    if(floatingMenu.building.level === undefined) {
      rotateSpecialBuilding(floatingMenu.building, (floatingMenu.building.orientation + d) % 4);
    }
    else {
      rotateBuilding(floatingMenu.building, (floatingMenu.building.orientation + d) % 4);
    }
  }

  const showSelectedProductivityMap = () => {
    showingProductivityMap.current = !showingProductivityMap.current;
    toggleProductivityMap(
      JSON.stringify(showProductivityMap) === JSON.stringify(map.current) ?
      undefined : 
      map.current
    );
  }

  // #endregion

  if(floatingMenu === null) return <></>;
  
  let buildingEdited = floatingMenu.building.id === undefined;
  instructions.forEach(element => {
    if(element.body.building?.id === floatingMenu.building.id && floatingMenu.building.id !== undefined) {
      buildingEdited = true;
    } 
  })

  return (
    <group position={[ 0, 3, 0 ]}>
      <Html
        ref={htmlRef}
        transform
        sprite
        distanceFactor={distanceFactor}
        position={floatingMenu.position}
      >
        <div className={styles.wrapper}>
          <span className={styles.title}>
            {floatingMenu.building.level !== undefined ? `Level ${floatingMenu.building.level+1}` : ''} {buildingMenuTypes[floatingMenu.building.type].name} {buildingEdited ? '*': ''}
          </span>
          {
            buildingMenuTypes[floatingMenu.building.type].properties?.map((property, index) => (
              <div key={`${floatingMenu.building.type}-${property}`}>
                {menuDataComponents[property](floatingMenu.building.type, floatingMenu.building.level+1, status==='upgrading')}
              </div>
            ))
          }
          {
            floatingMenu.building.level !== undefined ?
            <label className={styles.productivityMap}>
              <input 
                type="checkbox" 
                checked={JSON.stringify(showProductivityMap) === JSON.stringify(map.current)}
                onChange={() => showSelectedProductivityMap()} 
              />
              Productivity Map
            </label> :
            <></>
          }
          <span className={styles.description}>
            {buildingMenuTypes[floatingMenu.building.type].description}
          </span>
          <div className={styles.buttons}>
            <Buttons 
              status={status} 
              building={floatingMenu.building} 
              setStatus={setStatus} 
              upgrade={upgradeFunc} 
              sell={sellFunc} 
              rotate={rotateFunc}
            />
          </div>
        </div>
      </Html>
    </group>
  )
}

export default FloatingMenu