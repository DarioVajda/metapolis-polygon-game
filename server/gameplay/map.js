const buildingsModule = require('./building_stats');
const buildingTypes = buildingsModule.buildingTypes;
const buildingStats = buildingsModule.buildingStats;

const EventEmitter = require('events');
incomeCalculator = new EventEmitter();

const mapDimensions = 20; // dimenzije kvadrataste mape

// x i y koordinate su nepotrebne, sluzile su samo za debagovanje, kasnije ih mogu obrisati
class MapLand {
    constructor(occupiedBy, storeNearby, productivity, x, y) {
        this.occupiedBy = occupiedBy;
        this.storeNearby = storeNearby;
        this.productivity = productivity;
        this.gymBoost = 1;
        this.parkBoost = 1;
        this.x = x;
        this.y = y;
    }
} // klasa koja predstavlja jedno polje na mapi

function distanceFromStore(building, buildings) {
    var minDistance = 9999;
    var x;
    var y;
    var storex;
    var storey;
    buildings.normal.forEach((element) => {
        if(element.type == buildingTypes.Store || element.type == buildingTypes.SuperMarket) {
            storex = (element.start.x + element.end.x) / 2,
            storey = (element.start.y + element.end.y) / 2,
            x = (building.start.x + building.end.x) / 2;
            y = (building.start.y + building.end.y) / 2;

            minDistance = Math.min(Math.abs(x - storex) + Math.abs(y - storey), minDistance);
        }
    });
    return minDistance;
} // racuna najmanju razdaljinu do neke prodavnice (razdaljina se ne racuna pitagorinom nego se racuna kao zbir razlika na x i y koordinatama)

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
    } // inicijalizuje mapu

    // console.log(buildings);
    buildings.normal.forEach((element) => {
        switch(element.type) {
            case buildingTypes.House: // povecava se produktivnost ljudi u kucama
                map[element.start.y][element.start.x].productivity *= buildingStats.get(element.type)[element.level].boost;
                break;
            case buildingTypes.Store: // poljima u blizini se stavlja 'storeNearby' na true
                for(let i = Math.max(0, element.start.y - buildingStats.get(element.type)[element.level].range); i <= Math.min(mapDimensions - 1, element.start.y + element.type.range); i++) {
                    for(let j = Math.max(0, element.start.x - buildingStats.get(element.type)[element.level].range); j <= Math.min(mapDimensions - 1, element.start.x + element.type.range); j++) {
                        map[i][j].storeNearby = true;
                    }
                }
                break;
            case buildingTypes.Park: // povecava se produktivnost ljudi u blizini parka
                let park = Math.floor(((element.end.x - element.start.x + 1) + (element.end.y - element.start.y + 1)) / 2);
                for(let i = Math.max(0, element.start.y - park); i <= Math.min(mapDimensions - 1, element.end.y + park); i++) {
                    for(let j = Math.max(0, element.start.x - park); j <= Math.min(mapDimensions - 1, element.end.x + park); j++) {
                        if(1.1 > map[i][j].parkBoost) {
                            map[i][j].parkBoost = 1.1;
                        }
                    }
                }
                break;
            case buildingTypes.Gym: // povecava se produktivnost ljudi u blizini teretane
                for(let i = Math.max(0, element.start.y - buildingStats.get(element.type)[element.level].range); i <= Math.min(mapDimensions - 1, element.end.y + buildingStats.get(element.type)[element.level].range); i++) {
                    for(let j = Math.max(0, element.start.x - buildingStats.get(element.type)[element.level].range); j <= Math.min(mapDimensions - 1, element.end.x + buildingStats.get(element.type)[element.level].range); j++) {
                        if(1.2 > map[i][j].gymBoost) {
                            map[i][j].gymBoost = 1.2;
                        }
                    }
                }
                gym = 3;
                break;
            case buildingTypes.SuperMarket: // isto kao sa obicnu prodavnicu samo veci range
                for(let i = Math.max(0, element.start.y - buildingStats.get(element.type)[element.level].range); i <= Math.min(mapDimensions - 1, element.end.y + element.type.range); i++) {
                    for(let j = Math.max(0, element.start.x - buildingStats.get(element.type)[element.level].range); j <= Math.min(mapDimensions - 1, element.end.x + element.type.range); j++) {
                        map[i][j].storeNearby = true;
                    }
                }
                break;
            case buildingTypes.Factory: // smanjuje produktivnost ljudi u blizini jer ne mogu da disu od dima
                for(let i = 0; i < mapDimensions; i++) {
                    let distanceFromFactory = 0;
                    for(let j = 0; j < mapDimensions; j++) {
                        distanceFromFactory = pythagoreanTheorem(
                            (element.start.x + element.end.x) / 2 - i,
                            (element.start.y + element.end.y) / 2 - j,
                        );
                        if(distanceFromFactory < buildingStats.get(element.type)[element.level].radius) {
                            map[i][j].productivity *= 1 - buildingStats.get(element.type)[element.level].maxDecrease * distanceFromFactory / buildingStats.get(element.type)[element.level].radius;
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
                    // neka greska
                }
                else {
                    map[j][i].occupiedBy = element;
                    // stavlja se da je polje zauzeto od strane neke gradjevine
                }
            }
        }
    });
    for(let i = 0; i < mapDimensions; i++) {
        for(let j = 0; j < mapDimensions; j++) {
            map[i][j].productivity *= map[i][j].gymBoost * map[i][j].parkBoost;
            // racuna se productivity
        }
    }

    buildings.normal.forEach((element) => {
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
                    map[j][i].productivity *= 1 - buildingStats.get(buildingTypes.Store)[0].maxDecrease * distanceFromStore(element, buildings) / (2 * (mapDimensions - buildingStats.get(buildingTypes.Store)[0].range - 1));
                }
            }
        }
    }); // smanjivanje produktivnosti ljudi u zavisnosti od toga koliko su udaljeni od prodavnice
    
    return map;
}

exports.MapLand = MapLand;
exports.initializeMap = initializeMap;
exports.mapDimensions = mapDimensions;