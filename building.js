const EventEmitter = require('events');
incomeCalculator = new EventEmitter();

// ovo su brojevi koji
// oznacavaju gradjevine
const buildingTypes = {
    Factory: { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15 },
    Office: { cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 25 },
    Restaurant: { cost: 500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 20, officeWorkers: 5 },
    Parking: { cost: 50000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0 },
    Building: { cost: 40000, normalPeople: 33, educatedPeople: 9, manualWorkers: 0, officeWorkers: 0 },
    House: { cost: 200000, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0 },
    Store: { cost: 100000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0 },
    SuperMarket: { cost: 300000, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10 },
    Park: { cost: 30000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0 },
    Gym: { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0 }
}

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

function getBuildings() {
    // umesto 1, n treba da bude new Coordinate(.., ..), new Coordinate(.., ..) !!!
    var r = [
        // Factories (4):
        new Building(new Coordinate(1, 3), new Coordinate(2, 6), buildingTypes.Factory),
        new Building(new Coordinate(13, 4), new Coordinate(14, 7), buildingTypes.Factory),
        new Building(new Coordinate(18, 7), new Coordinate(19, 10), buildingTypes.Factory),
        new Building(new Coordinate(4, 19), new Coordinate(7, 20), buildingTypes.Factory),

        // Offices (2):
        new Building(new Coordinate(9, 7), new Coordinate(10, 9), buildingTypes.Office),
        new Building(new Coordinate(11, 11), new Coordinate(13, 12), buildingTypes.Office),
        
        // Restaurants (2):
        new Building(new Coordinate(11, 8), new Coordinate(11, 9), buildingTypes.Restaurant),
        new Building(new Coordinate(10, 11), new Coordinate(10, 12), buildingTypes.Restaurant),
        
        // Parkings (4):
        new Building(new Coordinate(6, 8), new Coordinate(6, 12), buildingTypes.Parking),
        new Building(new Coordinate(7, 14), new Coordinate(7, 16), buildingTypes.Parking),
        new Building(new Coordinate(8, 16), new Coordinate(10, 16), buildingTypes.Parking),
        new Building(new Coordinate(12, 8), new Coordinate(14, 10), buildingTypes.Parking),

        // Buildings (9):
        new Building(new Coordinate(8, 6), new Coordinate(10, 6), buildingTypes.Building),
        new Building(new Coordinate(7, 7), new Coordinate(8, 8), buildingTypes.Building),
        new Building(new Coordinate(7, 11), new Coordinate(7, 13), buildingTypes.Building),
        new Building(new Coordinate(9, 11), new Coordinate(9, 12), buildingTypes.Building),
        new Building(new Coordinate(8, 11), new Coordinate(8, 13), buildingTypes.Building),
        new Building(new Coordinate(14, 11), new Coordinate(15, 12), buildingTypes.Building),
        new Building(new Coordinate(11, 13), new Coordinate(11, 15), buildingTypes.Building),
        new Building(new Coordinate(12, 13), new Coordinate(13, 14), buildingTypes.Building),
        new Building(new Coordinate(8, 15), new Coordinate(10, 15), buildingTypes.Building),
        
        // Houses (21):
        new Building(new Coordinate(1, 7), new Coordinate(1, 7), buildingTypes.House),
        new Building(new Coordinate(1, 8), new Coordinate(1, 8), buildingTypes.House),
        new Building(new Coordinate(2, 8), new Coordinate(2, 8), buildingTypes.House),
        new Building(new Coordinate(3, 7), new Coordinate(3, 7), buildingTypes.House),
        new Building(new Coordinate(15, 7), new Coordinate(15, 7), buildingTypes.House),
        new Building(new Coordinate(15, 8), new Coordinate(15, 8), buildingTypes.House),
        new Building(new Coordinate(15, 9), new Coordinate(15, 9), buildingTypes.House),
        new Building(new Coordinate(15, 10), new Coordinate(15, 10), buildingTypes.House),
        new Building(new Coordinate(16, 8), new Coordinate(16, 8), buildingTypes.House),
        new Building(new Coordinate(16, 10), new Coordinate(16, 10), buildingTypes.House),
        new Building(new Coordinate(16, 11), new Coordinate(16, 11), buildingTypes.House),
        new Building(new Coordinate(16, 12), new Coordinate(16, 12), buildingTypes.House),
        new Building(new Coordinate(9, 10), new Coordinate(9, 10), buildingTypes.House),
        new Building(new Coordinate(10, 10), new Coordinate(10, 10), buildingTypes.House),
        new Building(new Coordinate(8, 14), new Coordinate(8, 14), buildingTypes.House),
        new Building(new Coordinate(9, 14), new Coordinate(9, 14), buildingTypes.House),
        new Building(new Coordinate(4, 18), new Coordinate(4, 18), buildingTypes.House),
        new Building(new Coordinate(3, 19), new Coordinate(3, 19), buildingTypes.House),
        new Building(new Coordinate(3, 20), new Coordinate(3, 20), buildingTypes.House),
        
        // Stores (3):
        new Building(new Coordinate(2, 7), new Coordinate(2, 7), buildingTypes.Store),
        new Building(new Coordinate(16, 9), new Coordinate(16, 9), buildingTypes.Store),
        new Building(new Coordinate(3, 18), new Coordinate(3, 18), buildingTypes.Store),
        new Building(new Coordinate(10, 14), new Coordinate(10, 14), buildingTypes.Store),
        new Building(new Coordinate(11, 10), new Coordinate(11, 10), buildingTypes.Store),
        
        // Supermarkets (1):
        new Building(new Coordinate(7, 9), new Coordinate(8, 10), buildingTypes.SuperMarket),
        
        // Parks (2):
        new Building(new Coordinate(8, 3), new Coordinate(12, 5), buildingTypes.Park),
        new Building(new Coordinate(14, 13), new Coordinate(16, 15), buildingTypes.Park),
        
        // GYM (1):
        new Building(new Coordinate(11, 6), new Coordinate(12, 7), buildingTypes.Gym)
    ];
    for(let i = 0; i < r.length; i++) {
        r[i].start.x -= 1;
        r[i].start.y -= 1;
        r[i].end.x -= 1;
        r[i].end.y -= 1;
    }
    return r;
}

function pythagoreanTheorem(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function getDistanceFromCenter(building, mapDimensions) {
    var x = Math.ceil((building.start.x + building.end.x) / 2);
    var y = Math.ceil((building.start.y + building.end.y) / 2);
    var r = Math.floor(pythagoreanTheorem(x - mapDimensions / 2, y - mapDimensions / 2));
    return r;
}

function initIncomeCalculator() {
    incomeCalculator.on(buildingTypes.Factory, function(arg) {
        const minIncome = 150000;
        const bonus = 5000;
        var distanceFromCenter = getDistanceFromCenter(arg.element, arg.mapDimensions);
        arg.element.income = minIncome + bonus * distanceFromCenter;
    });

    incomeCalculator.on(buildingTypes.Office, function(arg) {
        const incomePerCitizen = 100;
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.Restaurant, function(arg) { 
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.Parking, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.Building, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.House, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.Store, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.SuperMarket, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on(buildingTypes.Park, function(arg) {
        arg.element.income = 0;
    });

    incomeCalculator.on('' + buildingTypes.Gym.toString(), function(arg) {
        arg.element.income = 0;
    });
}

/// ovu funkciju trebam skoro skroz da promenim i bilo bi dobro da je stavim u novi fajl
function calculateIncome(buildings, mapDimensions) {
    initIncomeCalculator();
    var income = 0;
    var temp =  {'buildings': buildings, 'element': null, 'mapDimensions': mapDimensions}
    buildings.forEach(element => {
        // console.log( {'buildings': undefined, 'element': element, 'mapDimensions': mapDimensions});
        temp.element = element;
        incomeCalculator.emit(temp.element.type, temp);
        income += element.income;
    });
    buildings[0].income = 10;
    return income;
}

exports.buildingTypes = buildingTypes;
exports.calculateIncome = calculateIncome;
exports.getBuildings = getBuildings;
exports.Building = Building;
exports.Coordinate = Coordinate;