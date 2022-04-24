import React from 'react'
import House from './House'
import Factory from './Factory'
import { useBuildingStore } from './BuildingStore.js'
import { buildingTypes } from './BuildingTypes.js';
import { useGLTF } from '@react-three/drei'
import {gridDimensions,gridSize,plotSize} from './GridData'


export default function HoverObject() {
    const selectedBuilding=useBuildingStore(state=>state.selectedBuilding)
    let selectedBuildingType = selectedBuilding?buildingTypes[selectedBuilding][0]:null //checks if selectedBuilding is null
    const hoveredXY=useBuildingStore(state=>state.hoveredXY)
    const buildMode=useBuildingStore(state=>state.buildMode)

    if (selectedBuildingType && buildMode) {
        const posX=(hoveredXY.x+hoveredXY.x+selectedBuildingType.width)/2
        const posY=(hoveredXY.y+hoveredXY.y+selectedBuildingType.height)/2
        const position = [(plotSize*posX-gridSize*plotSize/2),0,(plotSize*posY-gridSize*plotSize/2-plotSize)];
        if(selectedBuildingType.type=='House')
        {
            return <House scale={1/6} key={'hoverObject'} position={position}/>
        }
        else if(selectedBuildingType.type=='Factory')
        {
            return <Factory scale={1/6} key={'hoverObject'} position={position}/>
        }
        else if(selectedBuildingType.type=='Building')
        {
            // return <House scale={1/6} key={'hoverObject'} position={position}/>
            return <></>
        }
        else
        {
            return <></>
        }
        
    }
    else
    {
        return <></>
    }
}

///// MOZDA SCALE DA SE RACUNA NA OSNOVU PLOTSIZE, OVAKO JE MALO GLUPO...