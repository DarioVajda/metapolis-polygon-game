import {React, useState,useCallback, useRef, useEffect} from 'react'
import { useBuildingStore, demolishOnGrid } from './BuildingStore.js';
import {gridDimensions,gridSize,plotSize} from './GridData'
import { buildingTypes } from './BuildingTypes.js';
import { generateUUID } from 'three/src/math/MathUtils';
import {ethers} from 'ethers'



const apiAddBuilding = async (id,[x0,y0],[x1,y1], type) => {
    const message = `Building ${type} in city ${id}, messageUUID:${generateUUID()}`;
  
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
  
    console.log(type)
    let body = JSON.stringify({building:{start:{x:x0,y:y0},end:{x:x1,y:y1},type:type,level:0},signature: signature,message: message });
    console.log(body);
    const response = await fetch(`http://localhost:8000/cities/${id}/build`, {
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
    console.log(response);
    return response
  };

function GridSquare(props){
    const selectedBuilding = useBuildingStore(state=> state.selectedBuilding)
    let selectedBuildingType = selectedBuilding?buildingTypes[selectedBuilding][0]:null //checks if selectedBuilding is null
    const gridDimensions = props.gridDimensions;
    const gridSize = props.gridSize;
    const plotSize = props.plotSize;
    const x=props.x;
    const y=props.y;
    const [hovered, setHover] = useState(false)
    const grid = useBuildingStore(state=>state.grid)
    const addBuilding = useBuildingStore(state=>state.addBuilding)
    const demolishBuilding = useBuildingStore(state=>state.removeBuilding);
    const buildMode = useBuildingStore(state=>state.buildMode);
    const setHoveredXY = useBuildingStore(state=>state.setHoveredXY)

    async function build(x,y,grid,selectedBuildingType){
        let buildable=true;
        if (selectedBuildingType === null){
            buildable=false
            console.log('no building type selected')
        }
        else if (x+selectedBuildingType.width>gridSize || y+selectedBuildingType.height>gridSize) {
            buildable=false;
            console.log('error: trying to build out of bounds')
        }
        else{
            for (let i = x; i < x+selectedBuildingType.width; i++) {
                for(let j = y; j< y+selectedBuildingType.height; j++){
                    if(grid[i*gridSize+j] != null && grid[i*gridSize+j] != undefined){
                        buildable=false
                    }
                }
            }
        }
        if(buildable){
            ////HERE ADD API CALL THEN ADDBUILDING IF RESPONSE IS OK //// ID IS ONLY 9 FOR NOW
            let response = await apiAddBuilding(9,[x,y],[x+selectedBuildingType.width-1,y+selectedBuildingType.height-1],selectedBuildingType.type)
            if(response.ok){
                addBuilding([x,y],[x+selectedBuildingType.width-1,y+selectedBuildingType.height-1],selectedBuildingType.type)
            }
            else{
                alert("HTTP-Error: "+ response.status)
            }
        }
        else
            console.log('can\'t build')
    }
    const remove = (x,y,grid)=>{
        let notEmpty=true;
        if(grid[x*gridSize+y] === null || grid[x*gridSize+y] === undefined)
            notEmpty=false;
        if(notEmpty)
            ////HERE ADD API CALL THEN DEMOLISHBUILDING IF RESPONSE IS OK
            demolishBuilding(grid[x*gridSize+y])
        else
            console.log('this grid square is empty already')
    }

    function onClick(e){
        e.stopPropagation()
        buildMode?build(x,y,grid,selectedBuildingType):remove(x,y,grid);
    }

    return(
        <mesh
        {...props}
        onPointerOver={(event)=>{setHover(true),setHoveredXY(props.x,props.y)}}
        onPointerOut={(event)=>setHover(false)}
        onClick={onClick}
        >
        <boxBufferGeometry attach="geometry"/>
        <meshLambertMaterial attach="material" color={hovered?(buildMode?0x88FF88:0xFF8888):'lightgray'} transparent opacity={props.built?0:(hovered?0.8:0.6)} />
        </mesh>
    )
}

export default function Grid() {
    const grid = useBuildingStore(state=>state.grid)
    const buildings =useBuildingStore(state=>state.buildings) //ovo je bitno jer se zbog ovoga refreshuje
    let position;
    let x;
    let y;
    return grid.map((element,index)=>{
        x=Math.floor(index/gridSize)
        y=index%gridSize;
        position = [(plotSize*x-gridSize*plotSize/2+plotSize/2),0,(plotSize*y-gridSize*plotSize/2-plotSize/2)];
        return <GridSquare gridSize={gridSize} gridDimensions={gridDimensions} plotSize={plotSize} key={index} position={position} scale={[plotSize*0.9,0.6,plotSize*0.9]} x={x} y={y} built={element?true:false}/>
    })
}
