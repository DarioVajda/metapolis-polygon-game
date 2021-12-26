const buildingsModule = require('./building');
const buildingTypes = buildingsModule.buildingTypes;

const EventEmitter = require('events');
incomeCalculator = new EventEmitter();


// x i y koordinate su nepotrebne, sluze samo za debagovanje, kasnije ih trebam obrisati!!!
class MapLand {
    constructor(occupied, storeNerby, productivityBoost, x, y) {
        this.occupied = occupied;
        this.storeNerby = storeNerby;
        this.productivityBoost = productivityBoost;
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
            map[i][j] = new MapLand(false, false, 0, j, i);
        }
    }

    // effect ranges:
    const store = 2;
    const superMarket = 3;
    const gym = 3;
    buildings.forEach((element) => {
        switch(element.type) {
            case buildingTypes.Store: 
                for(let i = Math.max(0, element.start.y - store); i < Math.min(mapDimensions, element.start.y + store); i++) {
                    for(let j = Math.max(0, element.start.x - store); j < Math.min(mapDimensions, element.start.x + store); j++) {
                        if(element.start.y !== i || element.start.x !== j) {
                            map[i][j].storeNerby = true;
                        }
                    }
                }
                break;
            case buildingTypes.Park: 
                // ovde treba neka kul formula da se napravi i odredi koliki je krug u kojem se daje boost
                break;
            case buildingTypes.Gym: 
                for(let i = Math.max(0, element.start.y - gym); i < Math.min(mapDimensions, element.end.y + gym); i++) {
                    for(let j = Math.max(0, element.start.x - gym); j < Math.min(mapDimensions, element.end.x + gym); j++) {
                        if(i < element.start.y || i > element.end.y || j < element.start.x || j > element.end.x) {
                            map[i][j].productivityBoost += 1;
                        }
                    }
                }
                break;
            case buildingTypes.SuperMarket:
                for(let i = Math.max(0, element.start.y - superMarket); i < Math.min(mapDimensions, element.end.y + superMarket); i++) {
                    for(let j = Math.max(0, element.start.x - superMarket); j < Math.min(mapDimensions, element.end.x + superMarket); j++) {
                        if(i < element.start.y || i > element.end.y || j < element.start.x || j > element.end.x) {
                            map[i][j].storeNerby = true;
                        }
                    }
                }
                break;
            default: break;
        }
        for(let i = element.start.x; i <= element.end.x; i++) {
            for(let j = element.start.y; j <= element.end.y; j++) {
                if(map[j][i] === true) {
                    console.log('doslo je do neke greske na koordinatama (' + i + ', ' + j + ')');
                }
                else {
                    map[j][i].occupied = true;
                }
            }
        }
    });
    return map;
}

exports.MapLand = MapLand;
exports.initializeMap = initializeMap;