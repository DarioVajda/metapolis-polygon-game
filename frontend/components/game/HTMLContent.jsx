import React, {useState,useRef, useEffect} from 'react'
import { Html } from '@react-three/drei'
import styles from '../styles/game.module.css'
import { Group } from 'three'
import {useBuildingStore} from './BuildingStore'
import GoldDiv from './HTMLComponents/goldIcon.jsx'
import EducatedWorkers from './HTMLComponents/educatedWorkers'
import UnEducatedWorkers from './HTMLComponents/unEducatedWorkers'
import { generateUUID } from 'three/src/math/MathUtils'
import { ethers } from 'ethers'

const getIncome = async (id) => {
    const message = `getting moola for #${id} City NFT, messageid: ` + generateUUID();
  
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
        const signature = await signer.signMessage(message);
    } catch (error) {
        return {ok:false,status:error.message}
    }
    const address = await signer.getAddress();
  
    let body = JSON.stringify({params:{id:id},address: address, message: message, signature: signature});
    console.log(body);
    const response = await fetch(`http://localhost:8000/cities/${id}/getincome`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body
    });
    if(response.ok)
        dataLoaded.current=false; /// need to refresh data if everything went through
  };


function HTMLContent() {
    const [data, setData] = useState(false);
    const dataLoaded = useRef(false);
    const buildings = useBuildingStore(state=>state.buildings) //added for refreshing on build


    // #region Getting the data
    async function getCityData (id) {
        let response = await fetch(`http://localhost:8000/cities/${id}/data`)
        if(response.ok){
            let json = await response.json()
            console.log('       html:')
            json.buildings.forEach(element => {
                console.log(element.type)
            });
            dataLoaded.current=true;
            setData(json);
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

    useEffect(() => {
        getCityData(1)
        console.log('new data')
    }, [dataLoaded.current,buildings])

        return (
    <>
    <div id='data' style={{pointerEvents:'none'}}>
        <GoldDiv value={(data && dataLoaded.current)?data.money:'...'}/>
        <EducatedWorkers value={(data && dataLoaded.current)?data.educated + ' / ' + data.educatedWorkers:'...'}/>
        <UnEducatedWorkers value={(data && dataLoaded.current)?data.normal + ' / ' + data.normalWorkers:'...'}/>
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
        <button className={selectedBuildingInList===4?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'32%'}} onClick={() =>{selectBuilding('store'),setSelectedBuildingInList(4)}}>Store</button>
        <button className={selectedBuildingInList===5?styles.roundedFixedBtnClicked:styles.roundedFixedBtn} style={{bottom:'15%',left:'42%'}} onClick={() =>{selectBuilding('office'),setSelectedBuildingInList(5)}}>Office</button>
    </div>
    <div id='utils' style={{pointerEvents:'none'}}>
        <button className={styles.roundedFixedBtn} style={{top:'12%',left:'2%',height:'8%'}} onClick={() => {getIncome(1)}}>Get income</button>
    </div>
    </>
        )
}

export default HTMLContent