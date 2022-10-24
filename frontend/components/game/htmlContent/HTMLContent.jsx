import React from 'react'
import { useState } from 'react';

import styles from './htmlContent.module.css';

import { useBuildingStore } from '../BuildingStore';

import Hover from '../../universal/hover/Hover';
import MoneyIcon from '../../universal/icons/MoneyIcon';
import IncomeIcon from '../../universal/icons/IncomeIcon';
import EducatedCityIcon from '../../universal/icons/achievement_icons/EducatedCityIcon';
import AchievementFrame from '../../universal/icons/achievement_icons/AchievementFrame';
import ArrowIcon from '../../universal/icons/ArrowIcon';

import { buildingDimensions } from '../../../../server/gameplay/building_stats';

const BuildingButton = ({ special, selected, type, changeType, element }) => {

  const changeDimensions = useBuildingStore(state => state.changeDimensions);

  const changeDimensionsClick = (e, arg) => {
    e.stopPropagation();
    changeDimensions(arg);
  }

  return (
    <button onClick={() => changeType(special, element)} style={selected ? { backgroundColor: 'var(--primary)' }:{}}>
      <div>
        {element}
      </div>
      <div>
        {
          selected ?
          <div>
            {
              buildingDimensions.get(element).length > 1 ?
              <div onClick={(e) => changeDimensionsClick(e, -1)}>
                <ArrowIcon direction={3} />
              </div> :
              <></>
            }
            <span style={{ fontSize: '.8rem' }}>
              {element}
              <br />
              {type.dimensions[0]}x{type.dimensions[1]}
            </span>
            {
              buildingDimensions.get(element).length > 1 ?
              <div onClick={(e) => changeDimensionsClick(e, 1)}>
                <ArrowIcon direction={1} />
              </div> :
              <></>
            }
          </div> :
          <div />
        }
        <span>
          <MoneyIcon /> 123.000
        </span>
      </div>
    </button>
  )
}

const HTMLContent = () => {

  const dynamicData = useBuildingStore(state => state.dynamicData);
  const staticData = useBuildingStore(state => state.staticData);
  
  const selectedBuildingType = useBuildingStore(state => state.selectedBuildingType);
  const setSelectedBuildingType = useBuildingStore(state => state.setSelectedBuildingType);

  // ovo je privremeno ovde
  const incrementRotationIndex = useBuildingStore(state => state.incrementRotationIndex);

  const [openedMenu, setOpenedMenu] = useState(null);

  const changeOpenedMenu = (om) => {
    setSelectedBuildingType(null, null);
    if(openedMenu === om) {
      setOpenedMenu(null);
    }
    else {
      setOpenedMenu(om);
    }
  }

  const changeSelectedBuildingType = (special, sbt) => {
    if(sbt === selectedBuildingType.type) {
      setSelectedBuildingType(null, null, [0, 0]);
    }
    else {
      setSelectedBuildingType(special, sbt);
    }
  }

  const normalBuildingButtons = [ 'house', 'building', 'factory', 'office', 'store', /* 'superMarket', 'gym', */ 'park' ];
  const specialBuildingButtons = [ 'statue', 'fountain', 'stadium', 'school', 'shoppingMall', 'promenade', 'townHall' ];

  if(staticData.owner === '0x00') return <></>
  else return (
    <div className={styles.contentWrapper}>
      <div className={styles.topData}>
        <Hover info='Money' underneath={true} childWidth='10em' specialId='Money' sidePadding='0.5em' >
          <div className={styles.topDataElement}>
            <MoneyIcon /> 
            <div>{dynamicData.money.toLocaleString('en-US')}</div>
          </div>
        </Hover>
        <Hover info='Income' underneath={true} childWidth='10em' specialId='Income' sidePadding='0.5em' >
          <div className={styles.topDataElement}>
            <IncomeIcon /> 
            <div>{dynamicData.income.toLocaleString('en-US')}</div>
          </div>
        </Hover>
        <Hover info='Educated' underneath={true} childWidth='10em' specialId='Educated' sidePadding='0.5em' >
          <div className={styles.topDataElement}>
            <EducatedCityIcon size={1} unit="em" /> {/* TODO This is temporary (make new icons) */} 
            <div>{dynamicData.educated}/{dynamicData.educatedWorkers}</div>
          </div>
        </Hover>
        <Hover info='Uneducated' underneath={true} childWidth='10em' specialId='Uneducated' sidePadding='0.5em' >
          <div className={styles.topDataElement}>
            <EducatedCityIcon size={1} unit="em" /> {/* TODO This is temporary (make new icons) */} 
            <div>{dynamicData.normal}/{dynamicData.normalWorkers}</div>
          </div>
        </Hover>
        <div>Income in 54m</div>
      </div>
      <div className={styles.bottomUI}>
        <div className={styles.buildingListGroup}>
          <button onClick={incrementRotationIndex}>
            <AchievementFrame backgroundColor='transparent' size={5} unit='em' />
            Achievements
          </button>
        </div>
        <div className={`${styles.buildingListGroup} ${openedMenu === 'normal' ? styles.expandedBuildingMenu : ''}`} style={ openedMenu === 'normal' ? { width: `${(normalBuildingButtons.length+1)*7.5-0.5}em` } : {}}> {/* if changing the width of the elements change the number 7.5 to width+0.5 */}
          <button onClick={() => changeOpenedMenu('normal')}>normal</button>
          {
            normalBuildingButtons.map((element, index) => (
              <BuildingButton 
                key={index}
                special={false} 
                selected={selectedBuildingType.type === element && !selectedBuildingType.special} 
                type={selectedBuildingType} 
                changeType={changeSelectedBuildingType} 
                element={element} 
              />
            ))
          }
        </div>
        <div className={`${styles.buildingListGroup} ${openedMenu === 'special' ? styles.expandedBuildingMenu : ''}`} style={ openedMenu === 'special' ? { width: `${(specialBuildingButtons.length+1)*7.5-0.5}em` } : {}}>
          <button onClick={() => changeOpenedMenu('special')}>special</button>
          {
            specialBuildingButtons.map((element, index) => (
              <BuildingButton 
                key={index}
                special={true} 
                selected={selectedBuildingType.type === element && selectedBuildingType.special} 
                type={selectedBuildingType} 
                changeType={changeSelectedBuildingType} 
                element={element}
              />
            ))
          }
        </div>
      </div>

      {/* <button onClick={() => console.log('button click')}>Dugme</button> */}
    </div>
  )
}

export default HTMLContent