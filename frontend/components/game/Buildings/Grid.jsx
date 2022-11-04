import React from 'react'
import { useBuildingStore } from '../BuildingStore'

import { useState, useRef } from 'react';

import { gridSize, plotSize } from '../MapData';
import { buildingDimensions, specialBuildingDimensions, buildingStats, specialPrices } from '../../../../server/gameplay/building_stats';
import { calculateCoordinates } from '../../../../server/gameplay/coordinates';

function GridSquare({ x, y, occupied }) {
  const setHover = useBuildingStore((state) => state.setHover);

  const selectedBuildingType = useBuildingStore(state => state.selectedBuildingType);
  const rotationIndex = useBuildingStore(state => state.rotationIndex);
  const buildings = useBuildingStore(state => state.buildings);
  const specialBuildings = useBuildingStore(state => state.specialBuildings);

  const addBuilding = useBuildingStore(state => state.addBuilding);
  const addSpecialBuilding = useBuildingStore(state => state.addSpecialBuilding);

  const [ isHovered, setIsHovered ] = useState(false);
  const gridSquareRef = useRef();

  const overlaps = () => {
    if(selectedBuildingType.special === null) return false;
    let dimensions = selectedBuildingType.dimensions;
    let { start, end } = calculateCoordinates(dimensions, rotationIndex%4, { x, y });

    if(
      start.x < 0 || 
      start.y < 0 || 
      end.x > gridSize-1 || 
      end.y > gridSize-1
    ) {
      return true;
    }

    let r = false;
    [ ...buildings, ...specialBuildings ].forEach((building2) => {
      if(!(
        start.x           > building2.end.x ||
        building2.start.x > end.x ||
        start.y           > building2.end.y ||
        building2.start.y > end.y
      )) {
        r = true;
      }
    });
    return r;
  }
  
  const onClick = () => { 
    if(selectedBuildingType.special === null) return;
    if(overlaps()) return;

    let dimensions = selectedBuildingType.dimensions;
    let { start, end } = calculateCoordinates(dimensions, rotationIndex%4, { x, y });
    let building = {
      start,
      end,
      type: selectedBuildingType.type,
      orientation: rotationIndex % 4 + 1
    }
    if(selectedBuildingType.special === false) {
      building.level = 0;
      let price = buildingStats.get(selectedBuildingType.type)[0].cost;
      if(selectedBuildingType.type === 'building' || selectedBuildingType.type === 'park') {
        price *= selectedBuildingType.dimensions[0] * selectedBuildingType.dimensions[1];
      }
      console.log(price);
      addBuilding(building, price);
    }
    else {
      let price = specialPrices.get(selectedBuildingType.type);
      addSpecialBuilding(building, price);
    }
  }

  return (
    <mesh
      ref={gridSquareRef}
      onPointerOver={event => {
        event.stopPropagation();
        // if(overlaps() && false) return; // ovo treba koristiti ako zelis da se iskljuci zabrana pomeranja
        if(overlaps()) return;
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
        color={isHovered ? 0x88ff88 : "lightgray"}
        transparent
        opacity={occupied ? 0 : (isHovered ? 0.7 : 0.5)}
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
      grid.push(
        <GridSquare x={x} y={y} key={x*gridSize+y} occupied={occupied[x][y]} />
      )
    }
  }

  return grid;
}

export default Grid