const EventEmitter = require('events');
incomeCalculator = new EventEmitter();

// ovo su brojevi koji
// oznacavaju gradjevine
const buildingTypes = {
    Factory: 1,
    Hotel: 2,
    Restaurant: 3,
    Parking: 4,
    Building: 5,
    House: 6,
    Store: 7,
    SuperMarket: 8,
    Park: 9,
    Gym: 10
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

        // Hotels (2):
        new Building(new Coordinate(9, 7), new Coordinate(10, 9), buildingTypes.Hotel),
        new Building(new Coordinate(11, 11), new Coordinate(13, 12), buildingTypes.Hotel),
        
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
        new Building(new Coordinate(8, 11), new Coordinate(9, 12), buildingTypes.Building),
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
        new Building(new Coordinate(16, 9), new Coordinate(16, 9), buildingTypes.House),
        new Building(new Coordinate(16, 10), new Coordinate(16, 10), buildingTypes.House),
        
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
        new Building(new Coordinate(4, 13), new Coordinate(16, 15), buildingTypes.Park),
        
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

incomeCalculator.on(buildingTypes.Factory, function(arg) { 
    arg.element.income = 10;
});

incomeCalculator.on(buildingTypes.Hotel, function(arg) { 
    arg.element.income = 10;
});

incomeCalculator.on(buildingTypes.Restaurant, function(arg) { 
    arg.element.income = 9;
});

incomeCalculator.on(buildingTypes.Parking, function(arg) { 
    arg.element.income = 9;
});

incomeCalculator.on(buildingTypes.Building, function(arg) { 
    arg.element.income = 8;
});

incomeCalculator.on(buildingTypes.House, function(arg) { 
    arg.element.income = 7;
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

incomeCalculator.on(buildingTypes.Gym, function(arg) { 
    arg.element.income = 4;
});

function calculateIncome(buildings) {
    var income = 0;
    var temp = {'buildings': buildings, 'element': 0};
    buildings.forEach(element => {
        temp.element = element;
        incomeCalculator.emit(element.type, temp);
        income += element.income;
    });
    return income;
}

exports.buildingTypes = buildingTypes;
exports.calculateIncome = calculateIncome;
exports.getBuildings = getBuildings;
exports.Building = Building;
exports.Coordinate = Coordinate;