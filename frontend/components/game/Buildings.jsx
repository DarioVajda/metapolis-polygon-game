import React from 'react'
import { useBuildingStore } from './BuildingStore.js'
import {gridDimensions,gridSize,plotSize} from './GridData'
import House from './models/House'
import Factory from './models/Factory'
import Building from './models/Building'


export default function Buildings() {
  const buildings = useBuildingStore(state => state.buildings)
  // console.log(buildings)
  return buildings.map((building) => {
    let Type=building.type;
    if(Type==='House')
    {
        const posX=(building.start[0]+building.end[0])/2
        const posY=(building.start[1]+building.end[1])/2
        const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
        return <House scale={1/6} key={building.uuid} position={position}/>
    }
    else if(Type==='Factory')
    {
      const posX=(building.start[0]+building.end[0])/2
      const posY=(building.start[1]+building.end[1])/2
        const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
        return <Factory scale={1/6} key={building.uuid} position={position}/>
    }
    else if(Type==='Building')
    {
      const posX=(building.start[0]+building.end[0])/2
      const posY=(building.start[1]+building.end[1])/2
        const position = [(plotSize*posX-gridSize*plotSize/2+plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize/2)];
        return <Building scale={1/6} key={building.uuid} position={position}/>
    }

    //add more later
  })
}

///// MOZDA SCALE DA SE RACUNA NA OSNOVU PLOTSIZE, OVAKO JE MALO GLUPO...