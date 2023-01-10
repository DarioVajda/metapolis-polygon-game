import React from 'react'
import { useBuildingStore } from '../BuildingStore'

import { useState, useRef } from 'react';

import { gridSize, plotSize } from '../MapData';
import { buildingDimensions, specialBuildingDimensions, buildingStats, specialPrices } from '../../../../server/gameplay/building_stats';
import { calculateCoordinates } from '../../../../server/gameplay/coordinates';

// TODO napraviti animaciju za menjanje boje polja

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
      addSpecialBuilding(building, price, false);
    }
  }

  // #endregion

  const rgbToNumber = ([r, g, b]) => {
    return r*256**2 + g*256 + b;
  }

  const productivityToColor = () => {
    if(showProductivityMap === false) {
      return (isHovered ? 0x88dd88 : 0xbbbbbb);
    }

    let productivity;
    // in case a building is selected and its productivity effect should be displayed then the showProductivityMap value will be the effect map, otherways the value is boolean
    // console.log(showProductivityMap);
    if(showProductivityMap !== true) {
      productivity = showProductivityMap[y][x];
      // productivity = map[y][x];
    }
    else {
      productivity = map[y][x];
    }
    // let productivity = map[x][y];
    
    let delta = 1.3;
    if(productivity > delta) return 'green';
    if(productivity < 1/delta) return 'red';
    
    let temp = (Math.log2(productivity)/Math.log2(delta) + 1) / 2;
    
    let red   = [ 255, 0  , 64  ];
    let grey  = [ 187, 187, 187 ];
    let green = [ 0  , 255, 64  ];
    // console.log(red.toString(16), grey.toString(16), green.toString(16));

    let color = [0, 0, 0];
    if(temp > 0.5) {
      color[0] = (temp - 0.5) * 2 * green[0] + (1 - temp) * 2 * grey[0];
      color[1] = (temp - 0.5) * 2 * green[1] + (1 - temp) * 2 * grey[1];
      color[2] = (temp - 0.5) * 2 * green[2] + (1 - temp) * 2 * grey[2];
    }
    else {
      color[0] = (0.5 - temp) * 2 * red[0] + (temp) * 2 * grey[0];
      color[1] = (0.5 - temp) * 2 * red[1] + (temp) * 2 * grey[1];
      color[2] = (0.5 - temp) * 2 * red[2] + (temp) * 2 * grey[2];
    }
    color = color.map(element => Math.floor(element));
    // console.log({ x, y, color: rgbToNumber(color).toString(16) });

    return rgbToNumber(color);
  }

  if(occupied) return null;
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
        color={productivityToColor()}
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