import React, { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useBuildingStore } from './BuildingStore.js'
import { buildingTypes } from './BuildingTypes.js';
import { useGLTF } from '@react-three/drei'
import {gridDimensions,gridSize,plotSize} from './GridData'
import House from './modelComponents/House'
import Factory from './modelComponents/Factory'
import Building from './modelComponents/Building'

export default function HoverObject() {
    const selectedBuilding=useBuildingStore(state=>state.selectedBuilding)
    let selectedBuildingType = selectedBuilding?buildingTypes[selectedBuilding][0]:null //checks if selectedBuilding is null - no building selected
    const hoveredXYCurrent=useBuildingStore(state=>state.hoveredXYCurrent)      ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
    const hoveredXYPrevious=useBuildingStore(state=>state.hoveredXYPrevious)    ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
    const buildMode=useBuildingStore(state=>state.buildMode)

    if (selectedBuildingType && buildMode) {
        const posXPrevious=(hoveredXYPrevious.x+hoveredXYPrevious.x+selectedBuildingType.width)/2       ///RACUNA POZICIJU NA GRIDU (ovo je float zbog gradjevina siroke 3 square itd)
        const posYPrevious=(hoveredXYPrevious.y+hoveredXYPrevious.y+selectedBuildingType.height)/2
        const positionPrevious = [(plotSize*posXPrevious-gridSize*plotSize/2),0,(plotSize*posYPrevious-gridSize*plotSize/2-plotSize)];  ///RACUNA 3D poziciju na mapi
        const posXCurrent=(hoveredXYCurrent.x+hoveredXYCurrent.x+selectedBuildingType.width)/2
        const posYCurrent=(hoveredXYCurrent.y+hoveredXYCurrent.y+selectedBuildingType.height)/2
        const positionCurrent = [(plotSize*posXCurrent-gridSize*plotSize/2),0,(plotSize*posYCurrent-gridSize*plotSize/2-plotSize)];


        if(selectedBuildingType.type=='House')
        {
            return <House scale={1/6} key={'hoverObject'} position={positionCurrent}/>
        }
        else if(selectedBuildingType.type=='Factory')
        {
            return <Factory scale={1/6} key={'hoverObject'} position={positionCurrent}/>
        }
        else if(selectedBuildingType.type=='Building')
        {
            return <Building scale={1/6} key={'hoverObject'} position={positionCurrent}/>
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