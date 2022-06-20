import { generateUUID } from "three/src/math/MathUtils";
import create from "zustand";
import { gridDimensions, gridSize, plotSize } from "./GridData";

const useBuildingStore = create((set) => ({
  buildings: [],
  grid: Array(gridSize * gridSize).fill(null, 0, gridSize * gridSize),
  uuid: generateUUID(),
  selectedBuilding: null,
  buildMode: true,
  hoveredXYCurrent: { x: 0, y: 0 },
  hoveredXYPrevious: { x: 0, y: 0 },
  hoverObjectMove: true,
  buildRotation: 0,
  selectBuilding: (type) => set(() => ({ selectedBuilding: type })),
  setBuildMode: (mode) => set(() => ({ buildMode: mode })),
  setHoveredXY: (x, y) =>
    set((state) => ({
      hoveredXYPrevious: state.hoveredXYCurrent,
      hoveredXYCurrent: { x: x, y: y },
    })),
  setRotation: (rotation) => set(() => ({buildRotation:rotation})),
  addBuilding: ([x0, y0], [x1, y1], type) =>
    set((state) => ({
      uuid: generateUUID(),
      buildings: [
        ...state.buildings,
        {
          start: { x: x0, y: y0 },
          end: { x: x1, y: y1 },
          type: type,
          uuid: state.uuid,
          orientation: 0,
          level: 0,
        },
      ],
      // ORIENTATION IS LEFT AS 0 FOR NOW, until rotation is implemented
      grid: buildingToGrid([x0, y0], [x1, y1], state.uuid, state.grid),
    })),
  removeBuilding: (uuid) =>
    set((state) => ({
      buildings: state.buildings
        .map((building, index, array) => {
          if (building.uuid === uuid) {
            return array[array.length - 1];
          } else {
            return building;
          }
        })
        .splice(0, state.buildings.length - 1),
      // buildings: state.buildings.filter(building => building.uuid!=uuid),
      grid: removeBuildingFromGrid(state.grid, uuid),
    })),
  // initializeBuildings: (buildings) => {
  //   let initializedBuildings=buildings.map(building => ({...building,uuid:generateUUID()}),
  //   set((state)=> ({  buildings: initializedBuildings,
  //                     grid: initializeGrid(initializedBuildings,state.grid)}))
  //   }
  initializeBuildings: (buildings) =>
    set((state) => ({
      buildings: buildings,
      grid: initializeGrid(buildings, state.grid),
    })),
}));

//Function to add building to grid
function buildingToGrid([x0, y0], [x1, y1], uuid, grid) {
  for (let i = x0; i <= x1; i++) {
    for (let j = y0; j <= y1; j++) {
      grid[i * gridSize + j] = uuid;
    }
  }
  return grid;
}

function eraseBuilding(uuid, buildings) {
  let found = buildings.find((building) => building.uuid === uuid);
  if (found != undefined) {
    found = buildings.pop();
  }
  return buildings;
}

function removeBuildingFromGrid(grid, uuid) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i * gridSize + j] == uuid) {
        grid[i * gridSize + j] = null;
      }
    }
  }
  return grid;
}

function initializeGrid(buildings, grid) {
  buildings.forEach((element) => {
    grid = buildingToGrid(
      [element.start.x, element.start.y],
      [element.end.x, element.end.y],
      element.uuid,
      grid
    );
  });
  return grid;
}

const post = async (body, link) => {
  const response = await fetch(link, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
};

export { useBuildingStore };
