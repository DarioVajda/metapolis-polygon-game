import create from "zustand";

import { devtools } from "zustand/middleware";

import { buildingDimensions } from "../../../server/gameplay/building_stats";

// #region UTILS:

const getDimensions = ({special, type, dimensions}, arg) => {
  if(special) {
    return [0, 0];
  }
  else {
    let list = buildingDimensions.get(type);
    if(arg === 0) {
      return list[0];
    }
    let index;
    buildingDimensions.get(type).forEach((element, i) => {
      if(element[0] == dimensions[0] && element[1] == dimensions[1]) {
        index = i;
      }
    })
    index += arg;
    index = (index + list.length) % list.length;
    return list[index];
  }
}

// #endregion


const buildingStore = (set) => ({
  // #region City data
  staticData: {
    owner: '0x00',
    created: true,
    initialized: true,
    theme: 0,
  },
  buildings: [],
  specialBuildings: [],
  dynamicData: {
    specialBuildingCash: [],
    money: 0,
    incomesReceived: 0,
    buildingId: 0,
    sepcialBuildingId: 0,
    normal: 0,
    educated: 0,
    normalWorkers: 0,
    educatedWorkers: 0,
    achievementList: [],
    income: 0,
    score: 0,
  },
  changeStaticData: changes => set( state => ({
    staticData: { ...state.staticData, ...changes }
  })),
  setBuildings: list => set( state => ({
    buildings: list
  })),
  setSpecialBuildings: list => set( state => ({
    specialBuildings: list 
  })),
  changeDynamicData: changes => set( state => ({
    dynamicData: { ...state.dynamicData, ...changes }
  })),
  // #endregion
  
  // #region Hovering
  hoverCurr: { x: 0, y: 0 },
  hoverPrev: { x: 0, y: 0 },
  setHover: (x, y) => set( state => ({
    hoverPrev: state.hoverCurr,
    hoverCurr: { x, y },
  })),
  selectedBuildingType: { special: null, type: null, dimensions: [ 0, 0 ] },
  changeDimensions: (arg) => set( state => ({
    // arg: 1 -> next, -1 -> previous
    selectedBuildingType: { ...state.selectedBuildingType, dimensions: getDimensions(state.selectedBuildingType, arg) }
  })),
  setSelectedBuildingType: (special, type) => set( state => ({
    selectedBuildingType: { special, type, dimensions: type?getDimensions({ special, type }, 0):[0,0] },
    // rotationIndex: 0
  })),
  rotationIndex: 0,
  incrementRotationIndex: (d) => set( state => ({
    rotationIndex: state.rotationIndex + d
  })),
  resetRotationIndex: () => set( state => ({
    rotationIndex: 0
  })),
  // #endregion

  // #region Instructions
  instructions: [],
  addBuilding: (building, price) => set( state => ( 
    price > state.dynamicData.money ? 
    { 
      error: { message: `Not enough money to build a ${building.type}`, type: 'popup-msg', options: { duration: '2s' } } 
    } : 
    {
      buildings: [ ...state.buildings, building ],
      instructions: [ ...state.instructions, { key: 'build', body: { building }} ],
      dynamicData: {
        ...state.dynamicData,
        money: state.dynamicData.money - price
      }
    }
  )),
  addSpecialBuilding: (building, price) => set( state => ( price > state.dynamicData.money ? {} : {
    buildings: [ ...state.buildings, building ],
    instructions: [ ...state.instructions, { key: 'buildspecial', body: { building }} ],
    dynamicData: {
      ...state.dynamicData,
      money: state.dynamicData.money - price
    }
  })),
  // #endregion

  // #region Floating module
  floatingMenu: null,
  setFloatingMenu: hm => set( state => (
    JSON.stringify(hm) === JSON.stringify(state.floatingMenu) ?
    { floatingMenu: null } : 
    { floatingMenu: hm   }
  )),
  // #endregion

  // #region error handling
  error: {},
  // #endregion
});

const useBuildingStore = create(devtools(buildingStore));

export { useBuildingStore };