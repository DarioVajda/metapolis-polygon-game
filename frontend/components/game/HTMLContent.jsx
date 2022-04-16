import React, {useState} from 'react'
import { Html } from '@react-three/drei'
import styles from '../../styles/game.module.css'
import { Group } from 'three'
import {useSelectedBuildingStore} from './selectedBuildingStore'



function HTMLContent() {
    const [showBuildingsList,setShowBuildingsList] = useState(false)
    const toggleBuildings = () => setShowBuildingsList(!showBuildingsList)
    const selectBuilding = useSelectedBuildingStore(state=>state.selectBuilding)
  return (
    <>
    <div id='menuButtons'>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',left:'2%'}} onClick={toggleBuildings}>Buildings</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',right:'12%'}}>Build</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',right:'2%'}}>Demolish</button>
    </div>
    <div id='buildingsList' hidden={!showBuildingsList}>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'2%'}} onMouseDown={console.log('a')}>House</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'12%'}} onMouseDown={console.log('b')}>Factory</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'22%'}} onMouseDown={console.log('c')}>Building</button>
    </div>
    }
    </>
        )
}

export default HTMLContent