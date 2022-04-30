const buildingTypes = {
    House: [{type: 'House',level:1,width:1,height:1,cost: 20000, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0, boost: 1.2},
            {type: 'House',level:2,width:1,height:1,cost: 20000, normalPeople: 4, educatedPeople: 7, manualWorkers: 0, officeWorkers: 0, boost: 1.2}],
    
    Building: [{type: 'Building',level:1,width:2,height:2,cost: 40000, normalPeople: 8, educatedPeople: 2, manualWorkers: 0, officeWorkers: 0},
               {type: 'Building',level:2,width:2,height:2,cost: 40000, normalPeople: 20, educatedPeople: 5, manualWorkers: 0, officeWorkers: 0}],
    
    Factory: [{type: 'Factory',level:1,width:2,height:3, cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15, radius: 10, maxDecrease: 0.15},
            {type: 'Factory',level:2,width:2,height:3,cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 70, officeWorkers: 30, radius: 10, maxDecrease: 0.1}],
    
    Office: [{type: 'Office',level:1,width:2,height:2,cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 25},
            {type: 'Office',level:2,width:2,height:2,cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 40}],

    Restaurant: [{type: 'Restaurant',level:1,width:2,height:1,cost: 500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 20, officeWorkers: 5}],

    Store: [{type: 'Store',level:1,width:1,height:1,cost: 100000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 2, maxDecrease: 0.3}],

    SuperMarket: [{type: 'SuperMarket',level:1,width:2,height:2,cost: 300000, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10, range: 3, maxDecrease: 0.3}],

    Gym: [{type: 'Gym',level:1,width:2,height:2,cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 3},
            {type: 'Gym',level:2,width:2,height:2,cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 15, officeWorkers: 0, range: 4}],
}

export {buildingTypes}
//GRADJEVINE KAO STO SU PARKING I PARK CE SE IMPLEMENTIRATI DRUGACIJE, JER SU ZONE