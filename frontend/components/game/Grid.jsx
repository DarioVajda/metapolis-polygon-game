import {React, useState,useCallback, useRef, useEffect} from 'react'
import { useBuildingStore, demolishOnGrid } from './BuildingStore';
import {gridDimensions,gridSize,plotSize} from './gridData'

function GridSquare(props){
    const gridDimensions = props.gridDimensions;
    const gridSize = props.gridSize;
    const plotSize = props.plotSize;
    const x=props.x;
    const y=props.y;
    const [hovered, setHover] = useState(false)
    const grid = useBuildingStore(state=>state.grid)
    const addBuilding = useBuildingStore(state=>state.addBuilding)
    const demolishBuilding = useBuildingStore(state=>state.removeBuilding);

    // ONCLICK ONLY ADDS HOUSE FOR NOW ///////////// TODO
    // ALSO SHOULD ADD CHECKS HERE, RIGTH NOW ONLY ADDS BUILDING WITH NO CHECKS
    const onClick = useCallback((e) => {
        e.stopPropagation()
        addBuilding([x,y],[x,y],'House')
    }, [])
    const onContextMenu = useCallback((e) => {
        e.stopPropagation()
        demolishBuilding(grid[x*gridSize+y])
    }, [])
    // const onWheel = useCallback((e) => {
    //     e.stopPropagation()
    // }, [])
    // DEBUG FUNCTION
    return(
        <mesh
        {...props}
        onPointerOver={(event)=>setHover(true)}
        onPointerOut={(event)=>setHover(false)}
        onClick={onClick}
        onContextMenu={onContextMenu}
        // onWheel={onWheel}
        >
        <boxBufferGeometry attach="geometry"/>
        <meshLambertMaterial attach="material" color={hovered?0x88FF88:'lightgray'} transparent opacity={props.built?0:(hovered?0.8:0.6)} />
        </mesh>
    )
}
function buildingBox(props){
    const gridDimensions = props.gridDimensions;
    const gridSize = props.gridSize;
    const plotSize = props.plotSize;
    const x=props.x;
    const y=props.y;
    return(
        <mesh
        {...props}>
        <boxBufferGeometry attach="geometry"/>
        <meshLambertMaterial attach="material" color={'lightGreen'}/>
        </mesh>
    )
}
// buildingBox might be used in the future for ground - probably will be replaced with better landscape model

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
