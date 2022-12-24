import create from "zustand";

import { devtools } from "zustand/middleware";

import { buildingDimensions, buildingStats, specialBuildingDimensions } from "../../../server/gameplay/building_stats";
import { getDynamicData } from "../../../server/gameplay/income";

import { rewardTypes } from "../achievements/achievements";

// #region UTILS:

const delay = async (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const getDimensions = ({special, type, dimensions}, arg) => {
  if(special) {
    return specialBuildingDimensions.get(type)[0];
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
    id: -1,
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
    map: Array(20).fill(Array(20).fill(1))
  },
  numOfNfts: 0,
  setNumOfNfts: n => set( state => ({
    numOfNfts: n
  })),
  changeStaticData: changes => set( state => ({
    staticData: { ...state.staticData, ...changes }
  })),
  setBuildings: (list, prefix) => set( state => {
    let buildingList = {};
    list.forEach(building => {
      buildingList[`${prefix?prefix:''}n_${building.start.x}_${building.start.y}`] = { building, status: 'built' };
    });

    return {
      buildings: list,
      ...buildingList
    }
  }),
  setSpecialBuildings: (list, prefix) => set( state => {
    let buildingList = {};
    list.forEach(building => {
      buildingList[`${prefix?prefix:''}s_${building.start.x}_${building.start.y}`] = { building, status: 'built' };
    });

    return {
      specialBuildings: list,
      ...buildingList
    }
  }),
  changeDynamicData: changes => set( state => ({
    dynamicData: { ...state.dynamicData, ...changes }
  })),
  changeCoordinate: (x, y, newValue, special) => set( state => {
    let obj = {};
    obj[`${special?'s':'n'}_${x}_${y}`] = newValue;
    return {
      ...obj
    }
  }),
  calculateIncome: () => set( state => {
    let { people, income, map } = getDynamicData({ buildings: state.buildings }, state.dynamicData.achievementList);
    return {
      dynamicData: {
        ...state.dynamicData,
        income: income,
        normal: people.normalPeople,
        educated: people.educatedPeople,
        normalWorkers: people.manualWorkers,
        educatedWorkers: people.officeWorkers,
        map: map
      }
    }
  }),
  // IMPORTANT - there will be entries with the keys with format 'n_x_y' or 's_x_y', the value of those entries are objects containing information about the building that has the specified start coordinates and the status of the building (possible values are 'building', 'built', 'removing', 'upgrading',...)

  // #endregion
  
  // #region Unchanged data

  unchangedData: {},
  setUnchangedData: () => set( state => ({
    unchangedData: { ...state, unchangedData: undefined }
  })),
  reuseUnchangedData: () => set( state => {
    const s = {};
    const n = {};
    for(let x = 0; x < 20; x++) {
      for(let y = 0; y < 20; y++) {
        n[`n_${x}_${y}`] = undefined;
        s[`s_${x}_${y}`] = undefined;
      }
    }

    return {
      ...n,
      ...s,
      ...state.unchangedData,
      unchangedData: { ...state, unchangedData: undefined }
    }
  }),

  // #endregion

  // #region Special buildings data
  // FIELDS - keys with format 'type_${type}' and values that contain information about the special building type ({ count, rarity, soldOut, offers })
  changeSpecialBuildingData: (data, type) => set( state => {
    let newDataField = {};
    newDataField[`type_${type}`] = data;
    return { ...newDataField };
  }),
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
    floatingMenu: null
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
  resetInstructions: () => set( state => ({
    instructions: []
  })),
  addBuilding: (building, price) => set( state => {
    if(price > state.dynamicData.money) {
      return ({ 
        popup: { message: `Not enough money to build a ${building.type}`, type: 'popup-msg', options: { duration: '2s' } } 
      });
    }
    else {
      let newBuildingCoordinate = {};
      newBuildingCoordinate[`n_${building.start.x}_${building.start.y}`] = { building, status: 'building' };
      return ({
        buildings: [ ...state.buildings, building ],
        instructions: [ ...state.instructions, { instruction: 'build', body: { building }, price: price } ],
        dynamicData: {
          ...state.dynamicData,
          money: state.dynamicData.money - price
        },
        ...newBuildingCoordinate
      });
    }
  }),
  addSpecialBuilding: (building, price, throughOffer) => set( state => {
    if(price > state.dynamicData.money) {
      return ({ 
        popup: { message: `Not enough money to build a ${building.type}`, type: 'popup-msg', options: { duration: '2s' } } 
      });
    }
    else {
      let newBuildingCoordinate = {};
      newBuildingCoordinate[`s_${building.start.x}_${building.start.y}`] = { building, status: 'building' };
      return ({
        specialBuildings: [ ...state.specialBuildings, building ],
        instructions: [ ...state.instructions, { instruction: 'buildspecial', body: { building, throughOffer } } ],
        dynamicData: {
          ...state.dynamicData,
          money: state.dynamicData.money - price
        },
        ...newBuildingCoordinate
      });
    }
  }),
  upgradeBuilding: (building, price) => set( state => {
    // checking if there is enough money to perform the upgrade
    if(price > state.dynamicData.money) {
      return {
        popup: { message: `Not enough money to upgrade the ${building.type}`, type: 'popup-msg', options: { duration: '2s' }}
      };
    }
    if(building.level + 1 === buildingStats.get(building.type).length) {
      return {
        popup: { message: 'Already at max level', type: 'popup-msg', options: { duration: '2s' }}
      };
    }

    // preparing to change the value of the x_y field in the state
    let buildingCoordinate = {};
    buildingCoordinate[`n_${building.start.x}_${building.start.y}`] = { building: { ...building, level: building.level+1 }, status: 'upgrading' };

    // copying the content of the building list, only changing this one level
    let newList = state.buildings.map(element => {
      if(JSON.stringify(element) === JSON.stringify(building)) {
        return {
          ...building,
          level: building.level+1
        }
      }
      return element;
    });

    // checks for the instruction list
    let isNewInstruction = true;
    let newInstructions = state.instructions.map(instruction => {
      // CASE: build + n*upgrade = build(level=n)
      if(
        JSON.stringify(instruction.body.building) === JSON.stringify({ ...building, level: instruction.body.building?.level }) && 
        instruction.instruction === 'build'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'build',
          body: {
            building: { ...instruction.body.building, level: instruction.body.building.level + 1 }
          },
          price: instruction.price + price
        }
      }
      // CASE: n*upgrade = upgrade(deltaLevel=n)
      else if(
        instruction.body.building?.id === building.id &&
        instruction.instruction === 'upgrade'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'upgrade',
          body: {
            building: instruction.body.building,
            deltaLevel: instruction.body.deltaLevel + 1
          },
          price: instruction.price + price
        }
      }
      return instruction;
    });
    console.log(newInstructions);
    if(isNewInstruction) {
      newInstructions = [ ...newInstructions, { instruction: 'upgrade', body: { building, deltaLevel: 1 }, price: price } ];
    }

    // returning all the changes to the global state
    return {
      buildings: newList,
      instructions: newInstructions,
      dynamicData: {
        ...state.dynamicData,
        money: state.dynamicData.money - price
      },
      ...buildingCoordinate
    }
  }),
  removeBuilding: (building, moneyValue) => set( state => {
    // preparing to change the value of the x_y field in the state
    let buildingCoordinate = {};
    buildingCoordinate[`n_${building.start.x}_${building.start.y}`] = { building, status: 'removing' };

    let newList = state.buildings.filter(element => !(
      (element.id !== undefined && element.id === building.id) ||
      JSON.stringify(element) === JSON.stringify({...building, orientation: element.orientation})
    ));
    // let newList = state.buildings.filter(element => JSON.stringify(element) !== JSON.stringify(building));

    let newInstructions = state.instructions;
    if(building.id === undefined) {
      newInstructions = newInstructions.filter(instruction => !(
        JSON.stringify(instruction.body.building) === JSON.stringify(building) &&
        instruction.instruction === 'build'
      ));
    }
    else {
      let isNewInstruction = true;
      newInstructions = newInstructions.map(instruction => {
        if(
          isNewInstruction &&
          instruction.body.building.id === building.id &&
          instruction.instruction === 'upgrade'
        ) {
          isNewInstruction = false;  
          return {
            instruction: 'remove',
            body: {
              building: instruction.body.building
            },
            price: instruction.price - moneyValue
          };
        }
        return instruction;
      });
      newInstructions = newInstructions.map(instruction => {
        if(
          isNewInstruction &&
          instruction.body.building.id === building.id &&
          instruction.instruction === 'rotate'
        ) {
          isNewInstruction = false;  
          return {
            instruction: 'remove',
            body: {
              building: instruction.body.building
            },
            price: -moneyValue
          };
        }
        return instruction;
      });

      if(isNewInstruction === false) {
        console.log(newInstructions);
        console.log(building);
        newInstructions = newInstructions.filter(instruction => !(
          instruction.instruction !== 'remove' && 
          instruction.body?.building?.id === building.id  
        ));
      }
      else {
        newInstructions = [ ...newInstructions, { instruction: 'remove', body: { building }, price: -moneyValue } ];
      }
    }

    // returning all the changes to the global state
    return {
      buildings: newList,
      instructions: newInstructions,
      dynamicData: {
        ...state.dynamicData,
        money: state.dynamicData.money + moneyValue
      },
      ...buildingCoordinate
    }
  }),
  removeSpecialBuilding: (building, moneyValue, throughOffer) => set( state => {
    // preparing to change the value of the x_y field in the state
    let buildingCoordinate = {};
    buildingCoordinate[`s_${building.start.x}_${building.start.y}`] = { building, status: 'removing' };

    let newList = state.specialBuildings.filter(element => !(
      (element.id !== undefined && element.id === building.id) ||
      JSON.stringify(element) === JSON.stringify({...building, orientation: element.orientation})
    ));
    // let newList = state.specialBuildings.filter(element => JSON.stringify(element) !== JSON.stringify(building));

    let newInstructions = state.instructions;
    if(building.id === undefined) {
      newInstructions = newInstructions.filter(instruction => !(
        JSON.stringify(instruction.body.building) === JSON.stringify(building) &&
        instruction.instruction === 'buildspecial'
      ));
    }
    else {
      let isNewInstruction = true;
      newInstructions = newInstructions.map(instruction => {
        if(
          isNewInstruction &&
          instruction.body.building.id === building.id &&
          instruction.instruction === 'rotatespecial'
        ) {
          isNewInstruction = false;  
          return {
            instruction: 'removespecial',
            body: {
              building: instruction.body.building,
              throughOffer
            },
            price: -moneyValue
          };
        }
        return instruction;
      });

      if(isNewInstruction === false) {
        console.log(newInstructions);
        console.log(building);
        newInstructions = newInstructions.filter(instruction => !(
          instruction.instruction !== 'removespecial' && 
          instruction.body?.building?.id === building.id  
        ));
      }
      else {
        newInstructions = [ ...newInstructions, { instruction: 'removespecial', body: { building, throughOffer }, price: -moneyValue } ];
      }
    }

    // returning all the changes to the global state
    return {
      specialBuildings: newList,
      instructions: newInstructions,
      dynamicData: {
        ...state.dynamicData,
        money: state.dynamicData.money + moneyValue
      },
      ...buildingCoordinate
    }
  }),
  rotateBuilding: (building, rotation) => set( state => {
    // preparing to change the value of the x_y field in the state
    let buildingCoordinate = {};
    buildingCoordinate[`n_${building.start.x}_${building.start.y}`] = { building: { ...building, orientation: rotation===0?4:rotation }, status: 'rotating' };

    // copying the content of the building list, only changing the orientation
    let newList = state.buildings.map(element => {
      if(JSON.stringify(element) === JSON.stringify({...building, orientation: building.orientation===0?4:building.orientation})) {
        // console.log(element, building);
        return {
          ...building,
          orientation: rotation===0?4:rotation
        }
      }
      return element;
    })

    let isNewInstruction = true;
    let newInstructions = state.instructions.map(instruction => {
      // CASE: n*rotate = rotate(n%4)
      if(
        instruction.body?.building?.id === building.id && 
        instruction.instruction === 'rotate'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'rotate',
          body: {
            building: instruction.body.building,
            rotation: rotation===0?4:rotation
          },
          price: 0
        }
      }
      // CASE: build + n*rotate = build(orientation: n%4)
      else if(
        JSON.stringify(instruction.body.building) === JSON.stringify({ ...building, orientation: instruction.body.building?.orientation }) &&
        instruction.instruction === 'build'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'build',
          body: {
            building: { ...instruction.body.building, orientation: rotation===0?4:rotation }
          },
          price: 0
        }
      }
      return instruction;
    });
    // console.log(newInstructions);
    newInstructions = newInstructions.filter(instruction => !(instruction.instruction === 'rotate' && instruction.body.building.orientation === instruction.body.rotation))
    if(isNewInstruction) {
      newInstructions = [ ...newInstructions, { instruction: 'rotate', body: { building, rotation }, price: 0 } ];
    }

    // returning all the changes to the global state
    return {
      buildings: newList,
      instructions: newInstructions,
      ...buildingCoordinate
    }
  }),
  rotateSpecialBuilding: (building, rotation) => set( state => {
    // preparing to change the value of the x_y field in the state
    let buildingCoordinate = {};
    buildingCoordinate[`s_${building.start.x}_${building.start.y}`] = { building: { ...building, orientation: rotation===0?4:rotation }, status: 'rotating' };

    // copying the content of the building list, only changing the orientation
    let newList = state.buildings.map(element => {
      if(JSON.stringify(element) === JSON.stringify({...building, orientation: building.orientation===0?4:building.orientation})) {
        // console.log(element, building);
        return {
          ...building,
          orientation: rotation===0?4:rotation
        }
      }
      return element;
    })

    let isNewInstruction = true;
    let newInstructions = state.instructions.map(instruction => {
      // CASE: n*rotate = rotate(n%4)
      if(
        instruction.body?.building?.id === building.id && 
        instruction.instruction === 'rotatespecial'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'rotatespecial',
          body: {
            building: instruction.body.building,
            rotation: rotation===0?4:rotation
          },
          price: 0
        }
      }
      // CASE: build + n*rotate = build(orientation: n%4)
      else if(
        JSON.stringify(instruction.body.building) === JSON.stringify({ ...building, orientation: instruction.body.building?.orientation }) &&
        instruction.instruction === 'buildspecial'
      ) {
        isNewInstruction = false;
        return {
          instruction: 'buildspecial',
          body: {
            building: { ...instruction.body.building, orientation: rotation===0?4:rotation }
          },
          price: 0
        }
      }
      return instruction;
    });
    // console.log(newInstructions);
    newInstructions = newInstructions.filter(instruction => !(instruction.instruction === 'rotatespecial' && instruction.body.building.orientation === instruction.body.rotation))
    if(isNewInstruction) {
      newInstructions = [ ...newInstructions, { instruction: 'rotatespecial', body: { building, rotation }, price: 0 } ];
    }

    // returning all the changes to the global state
    return {
      buildings: newList,
      instructions: newInstructions,
      ...buildingCoordinate
    }
  }),
  completed: (key, city, list) => set( state => {
    // let list = state.dynamicData.achievementList;
    let index = list.reduce((prev, curr, index) => prev === -1 && curr.key === key ? index : prev , -1);
    if(index === -1) {
      return {};
    }

    let cityData = city;
    console.log({ list, key, index });
    let achievement = list[index];

    // console.log({list});

    let reward = { value: achievement.rewardValue, type: achievement.rewardType };
    cityData = rewardTypes[reward.type].preview(cityData, reward.value);
    // poziva se funkcija koja dodaje ovo na listu instrukcija ili odmah cuva na serveru...

    // console.log(list[index]);
    
    list[index].count++;
    list[index].completed = true;
    list[index].check = {
      completed: true,
      main: '',
      message: '',
      value: 1
    }
    list = list.map(element => ({ ...element, check: element.checkFunction(cityData) }) );

    return {
      dynamicData: {
        ...state.dynamicData,
        specialBuildingCash:  cityData.specialBuildingCash,
        money:                cityData.money,
        incomesReceived:      cityData.incomesReceived,
        buildingId:           cityData.buildingId,
        sepcialBuildingId:    cityData.sepcialBuildingId,
        normal:               cityData.normal,
        educated:             cityData.educated,
        normalWorkers:        cityData.normalWorkers,
        educatedWorkers:      cityData.educatedWorkers,
        income:               cityData.income,
        score:                cityData.score,
        achievementList:      list.map(element => ({ 
          key: element.key, 
          count: element.count, 
          completed: element.completed 
        }))
      },
      instructions: [
        ...state.instructions,
        { 
          instruction: 'completed', 
          body: { achievement: key },
          price: city.money - cityData.money
        }
      ]
    }
  }),
  // #endregion

  // #region Floating module
  floatingMenu: null,
  setFloatingMenu: fm => set( state => (
    JSON.stringify(fm) === JSON.stringify(state.floatingMenu) ?
    { floatingMenu: null } : 
    { floatingMenu: fm, selectedBuildingType: { special: null, type: null, dimensions: [ 0, 0 ] } }
  )),
  // #endregion

  // #region Productivity map
  // in case a building is selected and its productivity effect should be displayed then the showProductivityMap value will be the effect map, otherways the value is boolean
  showProductivityMap: false,
  toggleProductivityMap: (selectedMap) => set( state => {
    return {
      showProductivityMap: selectedMap !== undefined ? selectedMap : state.showProductivityMap === false
    }
  }),
  // #endregion

  // #region popup handling
  popup: {}, // type, options, message
  setPopup: p => set( state => ({
    popup: p
  })),
  errors: [], // message
  addError: (msg, duration) => set( state => ({
    errors: [ ...state.errors, { message: msg, duration: duration } ]
  })),
  removeError: (msg, duration) => set( state => ({
    errors: state.errors.filter(element => !(element.message === msg && element.duration === duration)) 
  }))
  // #endregion
});

const useBuildingStore = create(devtools(buildingStore));

export { useBuildingStore };


/*

TODO instrukcije u frontendu:

brisanje:
- dodato -> (...upgradeovano) -> obrisano (vratiti full vrednost)
- upgradeovano -> obrisano (vratiti full vrednost upgradeova i procenat onoga sto je vec postojalo)

upgradeovanje:
- DONE: dodato -> upgradeovano (promeniti samo level u build instrukciji)
- DONE: upgradeovano -> upgradeovano (promeniti samo deltaLevel u instrukciji)

rotiranje:
- DONE: dodato -> rotirano (promeniti samo orientation u build instrukciji)
- DONE: rotirano -> rotirano (promeniti samo rotation u rotate instrukciji i proveriti da li je vraceno u pocetni polozaj)

*/