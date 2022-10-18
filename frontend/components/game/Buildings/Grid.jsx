import React from 'react'
import { useBuildingStore } from '../BuildingStore'

import { useState, useRef } from 'react';

import { gridSize, plotSize } from '../MapData';

function GridSquare({ x, y }) {
  const buildMode = useBuildingStore((state) => state.buildMode);
  const setHover = useBuildingStore((state) => state.setHover);

  const [isHovered, setIsHovered] = useState(false);
  const gridSquareRef = useRef();

  const onClick = () => { 
    console.log('click') 
  }

  return (
    <mesh
      ref={gridSquareRef}
      onPointerOver={event => {
        event.stopPropagation();
        setHover(x, y);
        setIsHovered(true);
      }}
      onPointerOut={(event) => {
        setIsHovered(false);
      }}
      onClick={onClick}
      position = {[
        plotSize * x - (gridSize * plotSize) / 2 + plotSize / 2,
        0,
        plotSize * y - (gridSize * plotSize) / 2 + plotSize / 2,
      ]}
      scale={[plotSize * 0.9, 0.5, plotSize * 0.9]}
      key={`${x},${y}`}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial
        attach="material"
        color={isHovered ? (buildMode != 2 ? 0x88ff88 : 0xff8888) : "lightgray"}
        transparent
        opacity={isHovered ? 0.7 : 0.5}
      />
    </mesh>
  );
}

const Grid = () => {

  const buildings = useBuildingStore(state => state.buildings);
  const specialBuildings = useBuildingStore(state => state.specialBuildings);

  let occupied = [];
  for(let x = 0; x < gridSize; x++) {
    occupied.push([]);
    for(let y = 0; y < gridSize; y++) {
      occupied[x].push(false);
    }
  }

  [...buildings, ...specialBuildings].forEach(element => {
    for(let x = element.start.x; x <= element.end.x; x++) {
      for(let y = element.start.y; y <= element.end.y; y++) {
        occupied[x][y] = true;
      }
    }
  })

  let grid = [];

  for(let x = 0; x < gridSize; x++) {
    for(let y = 0; y < gridSize; y++) {
      if(!occupied[x][y]) {
        grid.push(
          <GridSquare x={x} y={y} key={x*gridSize+y} />
        )
      }
    }
  }

  return grid;
}

export default Grid