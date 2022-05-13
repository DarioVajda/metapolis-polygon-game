import React, { useState,useEffect } from 'react'
import { useBuildingStore } from './BuildingStore.js'
import {gridDimensions,gridSize,plotSize,Scale} from './GridData'
import House from './modelComponents/House'
import Factory from './modelComponents/Factory'
import Building from './modelComponents/Building'
import { generateUUID } from 'three/src/math/MathUtils'



export default function Buildings() {
  const initializeBuildings = useBuildingStore(state=>state.initializeBuildings)
  const buildings = useBuildingStore(state=>state.buildings)

  async function getCityData (id) {
    let response = await fetch(`http://localhost:8000/cities/${id}/data`)
    if(response.ok){
      let json = await response.json()
      console.log(json)
      initializeBuildings(json.buildings.map(building => ({...building,uuid:generateUUID()})))
    }
    else{
      alert("HTTP-Error: "+ response.status)
    }
  }

  useEffect(() => {
    getCityData(0)
  }, [])
  
  //CURRENTLY UUID GENERATION IS NOT USED ANYWHERE
  if(buildings.length >0)
  {
    console.log(buildings)
    return buildings.map((building,index) => {
      // console.log(index+':'+building.type)
      let Type=building.type;
      const posX=(building.start.x+building.end.x)/2
      const posY=(building.start.y+building.end.y)/2
      const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
      const rotation=((Math.PI/2)*building.orientation)
      if(Type==='house')
      {
          return <House scale={Scale} key={generateUUID()} position={position} rotation={[0,rotation,0]}/>
      }
      else if(Type==='factory')
      {
          return <Factory scale={Scale} key={generateUUID()} position={position} rotation={[0,rotation,0]}/>
      }
      else if(Type==='building')
      {
          return <Building scale={Scale} key={generateUUID()} position={position} rotation={[0,rotation,0]}/>
      }
  
      //add more later
    })
  }
  else
  {
    return <></>
  }
}

///// MOZDA SCALE DA SE RACUNA NA OSNOVU PLOTSIZE, OVAKO JE MALO GLUPO...