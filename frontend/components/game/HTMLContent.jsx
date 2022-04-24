import React, {useState} from 'react'
import { Html } from '@react-three/drei'
import styles from '../styles/game.module.css'
import { Group } from 'three'
import {useBuildingStore} from './BuildingStore'



function HTMLContent() {
    const [showBuildingsList,setShowBuildingsList] = useState(false)
    const toggleBuildings = () => setShowBuildingsList(!showBuildingsList)
    const selectBuilding = useBuildingStore(state=>state.selectBuilding)
    const setBuildMode = useBuildingStore(state=>state.setBuildMode)
  return (
    <>
    <div id='menuButtons' pointerEvents='none'>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',left:'2%'}} onClick={toggleBuildings}>Buildings</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',right:'12%'}} onClick={()=>setBuildMode(true)}>Build</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',right:'2%'}} onClick={()=>setBuildMode(false)}>Demolish</button>
    </div>
    <div id='buildingsList' hidden={!showBuildingsList} pointerEvents='none'>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'2%'}} onClick={() =>selectBuilding('House')}>House</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'12%'}} onClick={() =>selectBuilding('Factory')}>Factory</button>
        <button className={styles.roundedFixedBtn} style={{bottom:'15%',left:'22%'}} onClick={() =>selectBuilding('Building')}>Building</button>
    </div>
    </>
        )
}

export default HTMLContent