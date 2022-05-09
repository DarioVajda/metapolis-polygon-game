import React, { useEffect, useRef } from 'react'
import { useBuildingStore } from './BuildingStore.js'
import { buildingTypes } from './BuildingTypes.js';
import { useGLTF } from '@react-three/drei'
import {gridDimensions,gridSize,plotSize,Scale} from './GridData'
import House from './modelComponents/House'
import Factory from './modelComponents/Factory'
import Building from './modelComponents/Building'
import { useFrame } from '@react-three/fiber';

function distance(a,b){
    return Math.sqrt((a.x-b.x)**2 + (a.z-b.z)**2);
}

export default function HoverObject() {
    const selectedBuilding=useBuildingStore(state=>state.selectedBuilding)
    let selectedBuildingType = selectedBuilding?buildingTypes[selectedBuilding][0]:null //checks if selectedBuilding is null - no building selected
    const hoveredXYCurrent=useBuildingStore(state=>state.hoveredXYCurrent)      ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
    const hoveredXYPrevious=useBuildingStore(state=>state.hoveredXYPrevious)    ///KADA SE I JEDAN OD OVA DVA PROMENI ONDA SE RERENDERUJE COMPONENT
    const buildMode=useBuildingStore(state=>state.buildMode)
    const hoverObjectMove=useBuildingStore(state=>state.hoverObjectMove)
    const hoverObjectRef = useRef() ///REF KOJI SE VEZE ZA HOVEROBJECT

    useFrame(() => {
        
        if (hoverObjectMove && selectedBuildingType && hoverObjectRef.current){
            let epsilon = 0.1;  //epsilon to optimize movement, so it doesn't move infinitely (allowed mistake)
            let moving=false;
            
            const posXCurrent=(hoveredXYCurrent.x+hoveredXYCurrent.x+selectedBuildingType.width)/2      ///RACUNA POZICIJU NA GRIDU (ovo je float zbog gradjevina siroke 3 square itd)
            const posYCurrent=(hoveredXYCurrent.y+hoveredXYCurrent.y+selectedBuildingType.height)/2
            const positionCurrent = [(plotSize*posXCurrent-gridSize*plotSize/2),0,(plotSize*posYCurrent-gridSize*plotSize/2-plotSize)]; ///RACUNA 3D poziciju na mapi
            
            if(Math.abs(hoverObjectRef.current.position.x - positionCurrent[0]) > epsilon || 
                Math.abs(hoverObjectRef.current.position.z - positionCurrent[2]) > epsilon) moving=true;
            //PROVERAVA DA LI JE U DOZOVLJENOJ GRESCI, AKO NIJE ONDA POMERAJ
            
            if(moving){     ///POMERANJE HOVEROBJECTA
                let deltax = positionCurrent[0] - hoverObjectRef.current.position.x;
                hoverObjectRef.current.position.x=(hoverObjectRef.current.position.x+deltax*0.2)
                let deltaz = positionCurrent[2] - hoverObjectRef.current.position.z;
                hoverObjectRef.current.position.z=(hoverObjectRef.current.position.z+deltaz*0.2)
            }
        }
      })

    if (selectedBuildingType && buildMode) {
        if(selectedBuildingType.type=='house')
        {
            return <House ref={hoverObjectRef} scale={Scale} key={'hoverObject'}/>
        }
        else if(selectedBuildingType.type=='factory')
        {
            return <Factory ref={hoverObjectRef} scale={Scale} key={'hoverObject'}/>
        }
        else if(selectedBuildingType.type=='building')
        {
            return <Building ref={hoverObjectRef} scale={Scale} key={'hoverObject'}/>
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