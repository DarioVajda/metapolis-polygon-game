import create from "zustand";

import { devtools } from "zustand/middleware";

const buildingStore = (set) => ({
  // #region city data
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
  setBuildings: list => set(state => ({
    buildings: list
  })),
  setSpecialBuildings: list => set(state => ({
    specialBuildings: list 
  })),
  changeDynamicData: changes => set( state => ({
    dynamicData: { ...state.dynamicData, ...changes }
  })),
  // #endregion
  
  // #region hovering
  hoverCurr: { x: 0, y: 0 },
  hoverPrev: { x: 0, y: 0 },
  setHover: (x, y) => set( state => ({
    hoverPrev: state.hoverCurr,
    hoverCurr: { x, y },
  })),
  // #endregion
});

const useBuildingStore = create(devtools(buildingStore));

export { useBuildingStore };