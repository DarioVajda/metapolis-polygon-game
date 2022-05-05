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
    let response = await fetch(`http://localhost:8000/cities/9/data`)
    console.log('got response')
    if(response.ok){
      let json = await response.json()
      initializeBuildings(json.buildings.map(building => ({...building,uuid:generateUUID()})))
    }
    else{
      alert("HTTP-Error: "+ response.status)
    }
  }

  useEffect(() => {
    getCityData()
  }, [])
  
  //CURRENTLY UUID GENERATION IS NOT USED ANYWHERE

  if(buildings.length >0)
  {
    return buildings.map((building) => {
      let Type=building.type;
      if(Type==='house')
      {
          // const posX=(building.start[0]+building.end[0])/2
          // const posY=(building.start[1]+building.end[1])/2
          const posX=(building.start.x+building.end.x)/2
          const posY=(building.start.y+building.end.y)/2
          const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
          // return <House scale={1/6} key={building.uuid} position={position}/>
          return <House scale={Scale} key={generateUUID()} position={position}/>
      }
      else if(Type==='factory')
      {
          // const posX=(building.start[0]+building.end[0])/2
          // const posY=(building.start[1]+building.end[1])/2
          const posX=(building.start.x+building.end.x)/2
          const posY=(building.start.y+building.end.y)/2
          const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
          // return <Factory scale={1/6} key={building.uuid} position={position}/>
          return <Factory scale={Scale} key={generateUUID()} position={position}/>
      }
      else if(Type==='building')
      {
          // const posX=(building.start[0]+building.end[0])/2
          // const posY=(building.start[1]+building.end[1])/2
          const posX=(building.start.x+building.end.x)/2
          const posY=(building.start.y+building.end.y)/2
          const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
          // return <Building scale={1/6} key={building.uuid} position={position}/>
          return <Building scale={Scale} key={generateUUID()} position={position}/>
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