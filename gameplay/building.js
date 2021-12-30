const EventEmitter = require('events');
incomeCalculator = new EventEmitter();

// ovo su brojevi koji
// oznacavaju gradjevine
const buildingTypes = {
    Factory: [
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15, radius: 10, maxDecrease: 0.15 },
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 70, officeWorkers: 30, radius: 10, maxDecrease: 0.1 }
    ],
    Office: [
        { cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 25 },
        { cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 40 }
    ],
    Restaurant: [
        { cost: 500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 20, officeWorkers: 5 }
    ],
    Parking: [
        { cost: 50000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0 },
    ],
    Building: [
        { cost: 40000, normalPeople: 32, educatedPeople: 8, manualWorkers: 0, officeWorkers: 0 },
        { cost: 40000, normalPeople: 80, educatedPeople: 20, manualWorkers: 0, officeWorkers: 0 }
    ],
    House: [
        { cost: 200000, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0, boost: 1.2 },
        { cost: 200000, normalPeople: 4, educatedPeople: 7, manualWorkers: 0, officeWorkers: 0, boost: 1.2 }
    ],
    Store: [
        { cost: 100000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 2, maxDecrease: 0.3 }
    ],
    SuperMarket: [
        { cost: 300000, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10, range: 3, maxDecrease: 0.3 }
    ],
    Park: [
        { cost: 30000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0, range: 0 }
    ],
    Gym: [
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 3 },
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 15, officeWorkers: 0, range: 4 }
    ]
} // const object with information about all the buildings
// fields contain arrays of the levels a building can be upgraded to

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Building {
    constructor(start, end, type) {
        this.start = start;
        this.end = end;
        this.type = type;
    }
}

// primer gradjevina: za testiranje: (kasnije ce se ovo ucitavati iz backenda)
var buildingList = [
    // Factories (4):
    new Building(new Coordinate(1, 3), new Coordinate(2, 6), buildingTypes.Factory[0]),
    new Building(new Coordinate(13, 4), new Coordinate(14, 7), buildingTypes.Factory[0]),
    new Building(new Coordinate(18, 7), new Coordinate(19, 10), buildingTypes.Factory[0]),
    new Building(new Coordinate(4, 19), new Coordinate(7, 20), buildingTypes.Factory[0]),

    // Offices (2):
    new Building(new Coordinate(9, 7), new Coordinate(10, 9), buildingTypes.Office[0]),
    new Building(new Coordinate(11, 11), new Coordinate(13, 12), buildingTypes.Office[0]),
    
    // Restaurants (2):
    new Building(new Coordinate(11, 8), new Coordinate(11, 9), buildingTypes.Restaurant[0]),
    new Building(new Coordinate(10, 11), new Coordinate(10, 12), buildingTypes.Restaurant[0]),
    
    // Parkings (4):
    new Building(new Coordinate(6, 8), new Coordinate(6, 12), buildingTypes.Parking[0]),
    new Building(new Coordinate(7, 14), new Coordinate(7, 16), buildingTypes.Parking[0]),
    new Building(new Coordinate(8, 16), new Coordinate(10, 16), buildingTypes.Parking[0]),
    new Building(new Coordinate(12, 8), new Coordinate(14, 10), buildingTypes.Parking[0]),

    // Buildings (9):
    new Building(new Coordinate(8, 6), new Coordinate(10, 6), buildingTypes.Building[0]),
    new Building(new Coordinate(7, 7), new Coordinate(8, 8), buildingTypes.Building[0]),
    new Building(new Coordinate(7, 11), new Coordinate(7, 13), buildingTypes.Building[0]),
    new Building(new Coordinate(8, 11), new Coordinate(9, 12), buildingTypes.Building[0]),
    new Building(new Coordinate(14, 11), new Coordinate(15, 12), buildingTypes.Building[0]),
    new Building(new Coordinate(11, 13), new Coordinate(11, 15), buildingTypes.Building[0]),
    new Building(new Coordinate(12, 13), new Coordinate(13, 14), buildingTypes.Building[0]),
    new Building(new Coordinate(8, 15), new Coordinate(10, 15), buildingTypes.Building[0]),
    
    // Houses (21):
    new Building(new Coordinate(1, 7), new Coordinate(1, 7), buildingTypes.House[0]),
    new Building(new Coordinate(1, 8), new Coordinate(1, 8), buildingTypes.House[0]),
    new Building(new Coordinate(2, 8), new Coordinate(2, 8), buildingTypes.House[0]),
    new Building(new Coordinate(3, 7), new Coordinate(3, 7), buildingTypes.House[0]),
    new Building(new Coordinate(15, 7), new Coordinate(15, 7), buildingTypes.House[0]),
    new Building(new Coordinate(15, 8), new Coordinate(15, 8), buildingTypes.House[0]),
    new Building(new Coordinate(15, 9), new Coordinate(15, 9), buildingTypes.House[0]),
    new Building(new Coordinate(15, 10), new Coordinate(15, 10), buildingTypes.House[0]),
    new Building(new Coordinate(16, 8), new Coordinate(16, 8), buildingTypes.House[0]),
    new Building(new Coordinate(16, 10), new Coordinate(16, 10), buildingTypes.House[0]),
    new Building(new Coordinate(16, 11), new Coordinate(16, 11), buildingTypes.House[0]),
    new Building(new Coordinate(16, 12), new Coordinate(16, 12), buildingTypes.House[0]),
    new Building(new Coordinate(9, 10), new Coordinate(9, 10), buildingTypes.House[0]),
    new Building(new Coordinate(10, 10), new Coordinate(10, 10), buildingTypes.House[0]),
    new Building(new Coordinate(8, 14), new Coordinate(8, 14), buildingTypes.House[0]),
    new Building(new Coordinate(9, 14), new Coordinate(9, 14), buildingTypes.House[0]),
    new Building(new Coordinate(4, 18), new Coordinate(4, 18), buildingTypes.House[0]),
    new Building(new Coordinate(3, 19), new Coordinate(3, 19), buildingTypes.House[0]),
    new Building(new Coordinate(3, 20), new Coordinate(3, 20), buildingTypes.House[0]),
    
    // Stores (3):
    new Building(new Coordinate(2, 7), new Coordinate(2, 7), buildingTypes.Store[0]),
    new Building(new Coordinate(16, 9), new Coordinate(16, 9), buildingTypes.Store[0]),
    new Building(new Coordinate(3, 18), new Coordinate(3, 18), buildingTypes.Store[0]),
    new Building(new Coordinate(10, 14), new Coordinate(10, 14), buildingTypes.Store[0]),
    new Building(new Coordinate(11, 10), new Coordinate(11, 10), buildingTypes.Store[0]),
    
    // Supermarkets (1):
    new Building(new Coordinate(7, 9), new Coordinate(8, 10), buildingTypes.SuperMarket[0]),
    
    // Parks (2):
    new Building(new Coordinate(8, 3), new Coordinate(12, 5), buildingTypes.Park[0]),
    new Building(new Coordinate(14, 13), new Coordinate(16, 15), buildingTypes.Park[0]),
    
    // GYM (1):
    new Building(new Coordinate(11, 6), new Coordinate(12, 7), buildingTypes.Gym[0])
];
for(let i = 0; i < buildingList.length; i++) {
    buildingList[i].start.x -= 1;
    buildingList[i].start.y -= 1;
    buildingList[i].end.x -= 1;
    buildingList[i].end.y -= 1;
} // ovo je tu samo da bi indeksi kretali od 0, inace nece trebati jer cemo vec tako generisati gradjevine

function getBuildings() {    
    return buildingList;
} // function will return something from the backend

function addBuilding(building) {
    buildingList.unshift(building);
} // adds building to the list, later it will change some data in the backend

function upgradeBuilding(index) {
    var upgrades = Object.values(buildingTypes);
    var found = {i: -1, j: -1};
    upgrades.forEach((type, i) => {
        type.forEach((upgrade, j) => {
            if(upgrade === buildingList[index].type) {
                found.i = i;
                found.j = j;
            }
        });
    });
    if(found.j === upgrades[found.i].length - 1) {
        console.log('Building is alreade upgraded to max level');
        return 0;
        // throwing out an error to the user
    }
    else {
        buildingList[index].type = upgrades[found.i][found.j+1];
        return buildingList[index].type.cost;
    }
} // function that upgrades a building if possible

exports.buildingTypes = buildingTypes;
exports.getBuildings = getBuildings;
exports.addBuilding = addBuilding;
exports.upgradeBuilding = upgradeBuilding;
exports.Building = Building;
exports.Coordinate = Coordinate;