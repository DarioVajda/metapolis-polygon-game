import create from 'zustand'
const useSelectedBuildingStore = create((set) => ({
    selectedBuilding: null,
    selectBuilding: (type) => set(() => ({selectedBuilding:type}))
  }))

export {useSelectedBuildingStore};