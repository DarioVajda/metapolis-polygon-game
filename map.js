const buildingsModule = require('./building');
const buildingTypes = buildingsModule.buildingTypes;
const Coordinate = buildingsModule.Coordinate;

const EventEmitter = require('events');
incomeCalculator = new EventEmitter();


// x i y koordinate su nepotrebne, sluze samo za debagovanje, kasnije ih trebam obrisati!!!
class MapLand {
    constructor(occupiedBy, storeNearby, productivity, x, y) {
        this.occupiedBy = occupiedBy;
        this.storeNearby = storeNearby;
        this.productivity = productivity;
        this.x = x;
        this.y = y;
    }
}

function distanceFromStore(building, buildings) {
    var minDistance = 9999;
    var x;
    var y;
    var storex;
    var storey;
    buildings.forEach((element) => {
        if(element.type == buildingTypes.Store[0] || element.type == buildingTypes.SuperMarket[0]) {
            storex = (element.start.x + element.end.x) / 2,
            storey = (element.start.y + element.end.y) / 2,
            x = (building.start.x + building.end.x) / 2;
            y = (building.start.y + building.end.y) / 2;

            minDistance = Math.min(Math.abs(x - storex) + Math.abs(y - storey), minDistance);
        }
    });
    return minDistance;
}

function pythagoreanTheorem(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function initializeMap(buildings, mapDimensions) {
    var map;
    map = Array(mapDimensions);
    for(let i = 0; i < mapDimensions; i++) {
        map[i] = Array(mapDimensions);
    }
    for(let i = 0; i < mapDimensions; i++) {
        for(let j = 0; j < mapDimensions; j++) {
            map[i][j] = new MapLand(null, false, 1, j, i);
        }
    }

    // effect ranges:
    const store = 2; // sqares of effect in every directi
    const superMarket = 3; // sqares of effect in every direction
    const gym = 3; // sqares of effect in every direction
    var park = 0; // sqares of effect in every direction (depends on the dimensions of the park)
    const factory = 10; // radius of a circle
    let maxFactoryDecrease = 0.1; // max productivity decrease from the factories pollution (0, 1)
    buildings.forEach((element) => {
        switch(element.type) {
            case buildingTypes.House[0]:
                map[element.start.y][element.start.x].productivity *= 1.2;
                break;
            case buildingTypes.House[1]:
                map[element.start.y][element.start.x].productivity *= 1.2;
                break;
            case buildingTypes.Store[0]:
                for(let i = Math.max(0, element.start.y - store); i <= Math.min(mapDimensions - 1, element.start.y + store); i++) {
                    for(let j = Math.max(0, element.start.x - store); j <= Math.min(mapDimensions - 1, element.start.x + store); j++) {
                        map[i][j].storeNearby = true;
                    }
                }
                break;
            case buildingTypes.Park[0]: 
                park = Math.floor(((element.end.x - element.start.x + 1) + (element.start.y - element.end.y + 1)) / 2);
                for(let i = Math.max(0, element.start.y - park); i <= Math.min(mapDimensions - 1, element.end.y + park); i++) {
                    for(let j = Math.max(0, element.start.x - park); j <= Math.min(mapDimensions - 1, element.end.x + park); j++) {
                        map[i][j].productivity *= 1.1;
                    }
                }
                break;
            case buildingTypes.Gym[0]:
            case buildingTypes.Gym[1]:
                for(let i = Math.max(0, element.start.y - gym); i <= Math.min(mapDimensions - 1, element.end.y + gym); i++) {
                    for(let j = Math.max(0, element.start.x - gym); j <= Math.min(mapDimensions - 1, element.end.x + gym); j++) {
                        map[i][j].productivity *= 1.2;
                    }
                }
                break;
            case buildingTypes.SuperMarket[0]:
                for(let i = Math.max(0, element.start.y - superMarket); i <= Math.min(mapDimensions - 1, element.end.y + superMarket); i++) {
                    for(let j = Math.max(0, element.start.x - superMarket); j <= Math.min(mapDimensions - 1, element.end.x + superMarket); j++) {
                        map[i][j].storeNearby = true;
                    }
                }
                break;
            case buildingTypes.Factory[0]:
            case buildingTypes.Factory[1]:
                for(let i = 0; i < mapDimensions; i++) {
                    let distanceFromFactory = 0;
                    for(let j = 0; j < mapDimensions; j++) {
                        distanceFromFactory = pythagoreanTheorem(
                            (element.start.x + element.end.x) / 2 - i,
                            (element.start.y + element.end.y) / 2 - j,
                        );
                        if(distanceFromFactory < factory) {
                            map[i][j].productivity *= 1 - maxFactoryDecrease * distanceFromFactory / factory;
                        } // 33346 / 26090
                    }
                }
                break;
            default: break;
        }
        for(let i = element.start.x; i <= element.end.x; i++) {
            for(let j = element.start.y; j <= element.end.y; j++) {
                if(map[j][i].occupiedBy !== null) {
                    console.log('doslo je do neke greske na koordinatama (' + i + ', ' + j + ')');
                    console.log(element);
                    console.log(map[j][i].occupiedBy);
                    console.log();
                }
                else {
                    map[j][i].occupiedBy = element;
                }
            }
        }
    });

    const maxDecreaseStore = 0.3 // max value the productivity can be decreased by (0, 1)
    buildings.forEach((element, index) => {
        var storeNearby = false;
        for(let i = element.start.x; i <= element.end.x; i++) {
            for(let j = element.start.y; j <= element.end.y; j++) {
                if(map[j][i].storeNearby === true) {
                    storeNearby = true;
                }
            }
        }
        if(storeNearby === false) {
            for(let i = element.start.x; i <= element.end.x; i++) {
                for(let j = element.start.y; j <= element.end.y; j++) {
                    map[j][i].productivity *= 1 - maxDecreaseStore * distanceFromStore(element, buildings) / (2 * (mapDimensions - store - 1));
                }
            }
        }
    })
    
    return map;
}

exports.MapLand = MapLand;
exports.initializeMap = initializeMap;