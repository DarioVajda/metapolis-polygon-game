import React, {useState} from 'react'
import { Html } from '@react-three/drei'
import styles from '../styles/game.module.css'
import { Group } from 'three'
import {useBuildingStore} from './BuildingStore'



function HTMLContent() {
    const [showBuildingsList,setShowBuildingsList] = useState(false)
    const [selectedBuildingInList,setSelectedBuildingInList] = useState(0)
    const toggleBuildings = () => setShowBuildingsList(!showBuildingsList)
    const selectBuilding = useBuildingStore(state=>state.selectBuilding)
    const setBuildMode = useBuildingStore(state=>state.setBuildMode)
    const buildMode = useBuildingStore(state=>state.buildMode)
  return (
    <>
    <div id='menuButtons' pointerEvents='none'>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',left:'2%'}} onClick={toggleBuildings}>Buildings</button>
        <button className={buildMode?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'2%',right:'12%'}} onClick={()=>setBuildMode(true)}>Build</button>
        <button className={buildMode?styles.roundedFixedBtn:styles.roundedFixedBtnClicked} style={{bottom:'2%',right:'2%'}} onClick={()=>setBuildMode(false)}>Demolish</button>
    </div>
    <div id='buildingsList' hidden={!showBuildingsList} pointerEvents='none'>
        <button className={selectedBuildingInList===1?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'2%'}} onClick={() =>{selectBuilding('House'),setSelectedBuildingInList(1)}}>House</button>
        <button className={selectedBuildingInList===2?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'12%'}} onClick={() =>{selectBuilding('Factory'),setSelectedBuildingInList(2)}}>Factory</button>
        <button className={selectedBuildingInList===3?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'22%'}} onClick={() =>{selectBuilding('Building'),setSelectedBuildingInList(3)}}>Building</button>
    </div>
    </>
        )
}

export default HTMLContent