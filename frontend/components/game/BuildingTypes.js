const buildingTypes = {
    house: [{type: 'house',level:1,width:1,height:1,cost: 1, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0, boost: 1.2},
            {type: 'house',level:2,width:1,height:1,cost: 1, normalPeople: 4, educatedPeople: 7, manualWorkers: 0, officeWorkers: 0, boost: 1.2}],
    
    building: [{type: 'building',level:1,width:2,height:2,cost: 1, normalPeople: 8, educatedPeople: 2, manualWorkers: 0, officeWorkers: 0},
               {type: 'building',level:2,width:2,height:2,cost: 1, normalPeople: 20, educatedPeople: 5, manualWorkers: 0, officeWorkers: 0}],

    longbuilding: [{type: 'longbuilding',level:1,width:1,height:3,cost: 1, normalPeople: 8, educatedPeople: 2, manualWorkers: 0, officeWorkers: 0},
                {type: 'longbuilding',level:2,width:1,height:3,cost: 1, normalPeople: 20, educatedPeople: 5, manualWorkers: 0, officeWorkers: 0}],
    
    factory: [{type: 'factory',level:1,width:2,height:4, cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15, radius: 10, maxDecrease: 0.15},
            {type: 'factory',level:2,width:2,height:4,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 70, officeWorkers: 30, radius: 10, maxDecrease: 0.1}],
    
    office: [{type: 'office',level:1,width:2,height:2,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 25},
            {type: 'office',level:2,width:2,height:2,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 40}],

    restaurant: [{type: 'restaurant',level:1,width:2,height:1,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 20, officeWorkers: 5}],

    store: [{type: 'store',level:1,width:1,height:1,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 2, maxDecrease: 0.3}],

    supermarket: [{type: 'supermarket',level:1,width:2,height:2,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10, range: 3, maxDecrease: 0.3}],

    gym: [{type: 'gym',level:1,width:2,height:2,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 3},
            {type: 'gym',level:2,width:2,height:2,cost: 1, normalPeople: 0, educatedPeople: 0, manualWorkers: 15, officeWorkers: 0, range: 4}],
}

export {buildingTypes}
//GRADJEVINE KAO STO SU PARKING I PARK CE SE IMPLEMENTIRATI DRUGACIJE, JER SU ZONE