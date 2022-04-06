import {React, useState,useCallback, useRef, useEffect} from 'react'
import { useBuildingStore, demolishOnGrid } from './BuildingStore';

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
        <meshLambertMaterial attach="material" color={hovered?0x88FF88:'lightgray'} transparent opacity={(hovered?0.618:0)} />
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

export default function Grid() {
    const gridDimensions = 100;
    const gridSize = 10;
    const plotSize = gridDimensions/gridSize;
    const grid = useBuildingStore(state=>state.grid)
    let position;
    let x;
    let y;
    return grid.map((element,index)=>{
        x=Math.floor(index/gridSize)
        y=index%gridSize;
        position = [(plotSize*x-gridSize*plotSize/2+plotSize/2),0,(plotSize*y-gridSize*plotSize/2-plotSize/2)];
        return <GridSquare gridSize={gridSize} gridDimensions={gridDimensions} plotSize={plotSize} key={index} position={position} scale={[plotSize,0.3,plotSize]} x={x} y={y}/>
    })
}
