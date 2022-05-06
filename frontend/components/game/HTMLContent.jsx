import React, {useState,useRef} from 'react'
import { Html } from '@react-three/drei'
import styles from '../styles/game.module.css'
import { Group } from 'three'
import {useBuildingStore} from './BuildingStore'
import GoldDiv from './HTMLComponents/goldIcon.jsx'




function HTMLContent() {
    const [data, setData] = useState(false);
    const dataLoaded = useRef(false);


    // #region Getting the data
    async function getCityData (id) {
        let response = await fetch(`http://localhost:8000/cities/${id}/data`)
        if(response.ok){
        let json = await response.json()
        setData(json);
        dataLoaded.current=true;
        }
        else{
        alert("HTTP-Error: "+ response.status)
        }
    }

    // #endregion

    // TODO:    SHOULD RELOAD DATA IN INTERVALS, OR WHEN SOMETHING CHANGES
    //          THIS WILL BE FIXED

    const [showBuildingsList,setShowBuildingsList] = useState(false)
    const [selectedBuildingInList,setSelectedBuildingInList] = useState(0)
    const toggleBuildings = () => setShowBuildingsList(!showBuildingsList)
    const selectBuilding = useBuildingStore(state=>state.selectBuilding)
    const setBuildMode = useBuildingStore(state=>state.setBuildMode)
    const buildMode = useBuildingStore(state=>state.buildMode)
    if(!dataLoaded.current)
        getCityData(9)
  return (
    <>
    <div id='income' style={{pointerEvents:'none'}}>
        <GoldDiv value={data?data.money:'...'}/>
    </div>
    <div id='menuButtons' style={{pointerEvents:'none'}}>
        <button className={styles.roundedFixedBtn} style={{bottom:'2%',left:'2%'}} onClick={toggleBuildings}>Buildings</button>
        <button className={buildMode?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'2%',right:'12%'}} onClick={()=>setBuildMode(true)}>Build</button>
        <button className={buildMode?styles.roundedFixedBtn:styles.roundedFixedBtnClicked} style={{bottom:'2%',right:'2%'}} onClick={()=>setBuildMode(false)}>Demolish</button>
    </div>
    <div id='buildingsList' hidden={!showBuildingsList} style={{pointerEvents:'none'}}>
        <button className={selectedBuildingInList===1?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'2%'}} onClick={() =>{selectBuilding('house'),setSelectedBuildingInList(1)}}>House</button>
        <button className={selectedBuildingInList===2?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'12%'}} onClick={() =>{selectBuilding('factory'),setSelectedBuildingInList(2)}}>Factory</button>
        <button className={selectedBuildingInList===3?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'22%'}} onClick={() =>{selectBuilding('building'),setSelectedBuildingInList(3)}}>Building</button>
    </div>
    </>
        )
}

export default HTMLContent