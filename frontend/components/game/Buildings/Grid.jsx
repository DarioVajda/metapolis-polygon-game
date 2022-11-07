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
  const calculateIncome = useBuildingStore(state => state.calculateIncome);

  const showProductivityMap = useBuildingStore(state => state.showProductivityMap);
  const { map } = useBuildingStore(state => state.dynamicData);

  const [ isHovered, setIsHovered ] = useState(false);
  const gridSquareRef = useRef();

  // #region Building on click

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
      calculateIncome();
    }
    else {
      let price = specialPrices.get(selectedBuildingType.type);
      addSpecialBuilding(building, price);
    }
  }

  // #endregion

  const productivityToColor = () => {
    // if(x === 2 && y === 1) return 'blue';
    let productivity = map[y][x];
    // let productivity = map[x][y];
    
    let delta = 1.3;
    if(productivity > delta) return 'green';
    if(productivity < 1/delta) return 'red';
    
    let temp = (Math.log2(productivity)/Math.log2(delta) + 1) / 2;
    // console.log(temp);
    let color = 64; // blue is 50%

    color += 256 * Math.floor(temp * 256); // green color calculated based on the productivity

    color += 256**2 * Math.floor((1 - temp) * 256); // red color calculated based on the productivity

    return color;
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
        color={showProductivityMap ? productivityToColor() : (isHovered ? 0x88dd88 : 0xbbbbbb)}
        transparent
        opacity={occupied ? 0 : (isHovered ? 1 : 0.6)}
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