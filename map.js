const buildingsModule = require('./building');
const buildingTypes = buildingsModule.buildingTypes;

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
    const store = 2;
    const superMarket = 3;
    const gym = 3;
    var park = 0;
    buildings.forEach((element) => {
        switch(element.type) {
            case buildingTypes.Store:
                for(let i = Math.max(0, element.start.y - store); i <= Math.min(mapDimensions - 1, element.start.y + store); i++) {
                    for(let j = Math.max(0, element.start.x - store); j <= Math.min(mapDimensions - 1, element.start.x + store); j++) {
                        if(element.start.y !== i || element.start.x !== j) {
                            map[i][j].storeNearby = true;
                        }
                    }
                }
                break;
            case buildingTypes.Park: 
                park = Math.floor(((element.end.x - element.start.x + 1) + (element.start.y - element.end.y + 1)) / 2);
                for(let i = Math.max(0, element.start.y - park); i <= Math.min(mapDimensions - 1, element.end.y + park); i++) {
                    for(let j = Math.max(0, element.start.x - park); j <= Math.min(mapDimensions - 1, element.end.x + park); j++) {
                        if(i < element.start.y || i > element.end.y || j < element.start.x || j > element.end.x) {
                            map[i][j].productivity *= 1.1;
                        }
                    }
                }
                break;
            case buildingTypes.Gym: 
                for(let i = Math.max(0, element.start.y - gym); i <= Math.min(mapDimensions - 1, element.end.y + gym); i++) {
                    for(let j = Math.max(0, element.start.x - gym); j <= Math.min(mapDimensions - 1, element.end.x + gym); j++) {
                        if(i < element.start.y || i > element.end.y || j < element.start.x || j > element.end.x) {
                            map[i][j].productivity *= 1.2;
                        }
                    }
                }
                break;
            case buildingTypes.SuperMarket:
                for(let i = Math.max(0, element.start.y - superMarket); i <= Math.min(mapDimensions - 1, element.end.y + superMarket); i++) {
                    for(let j = Math.max(0, element.start.x - superMarket); j <= Math.min(mapDimensions - 1, element.end.x + superMarket); j++) {
                        if(i < element.start.y || i > element.end.y || j < element.start.x || j > element.end.x) {
                            map[i][j].storeNearby = true;
                        }
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
    return map;
}

exports.MapLand = MapLand;
exports.initializeMap = initializeMap;