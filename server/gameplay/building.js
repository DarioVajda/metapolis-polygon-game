const stats = require('./building_stats');
const Building = stats.Building;
const Coordinate = stats.Coordinate;
const buildingTypes = stats.buildingTypes;
const buildingStats = stats.buildingStats;

const generateModule = require('../rand_map/generate');

// primer gradjevina: za testiranje: (kasnije ce se ovo ucitavati iz backenda)
/*
var buildingList = [
    // Factories (4):
    new Building(new Coordinate(1, 3), new Coordinate(2, 6), buildingTypes.Factory, 0),
    new Building(new Coordinate(13, 4), new Coordinate(14, 7), buildingTypes.Factory, 0),
    new Building(new Coordinate(18, 7), new Coordinate(19, 10), buildingTypes.Factory, 0),
    new Building(new Coordinate(4, 19), new Coordinate(7, 20), buildingTypes.Factory, 0),

    // Offices (2):
    new Building(new Coordinate(9, 7), new Coordinate(10, 9), buildingTypes.Office, 0),
    new Building(new Coordinate(11, 11), new Coordinate(13, 12), buildingTypes.Office, 0),
    
    // Restaurants (2):
    new Building(new Coordinate(11, 8), new Coordinate(11, 9), buildingTypes.Restaurant, 0),
    new Building(new Coordinate(10, 11), new Coordinate(10, 12), buildingTypes.Restaurant, 0),
    
    // Parkings (4):
    new Building(new Coordinate(6, 8), new Coordinate(6, 12), buildingTypes.Parking, 0),
    new Building(new Coordinate(7, 14), new Coordinate(7, 16), buildingTypes.Parking, 0),
    new Building(new Coordinate(8, 16), new Coordinate(10, 16), buildingTypes.Parking, 0),
    new Building(new Coordinate(12, 8), new Coordinate(14, 10), buildingTypes.Parking, 0),

    // Buildings (9):
    new Building(new Coordinate(8, 6), new Coordinate(10, 6), buildingTypes.Building, 0),
    new Building(new Coordinate(7, 7), new Coordinate(8, 8), buildingTypes.Building, 0),
    new Building(new Coordinate(7, 11), new Coordinate(7, 13), buildingTypes.Building, 0),
    new Building(new Coordinate(8, 11), new Coordinate(9, 12), buildingTypes.Building, 0),
    new Building(new Coordinate(14, 11), new Coordinate(15, 12), buildingTypes.Building, 0),
    new Building(new Coordinate(11, 13), new Coordinate(11, 15), buildingTypes.Building, 0),
    new Building(new Coordinate(12, 13), new Coordinate(13, 14), buildingTypes.Building, 0),
    new Building(new Coordinate(8, 15), new Coordinate(10, 15), buildingTypes.Building, 0),
    
    // Houses (21):
    new Building(new Coordinate(1, 7), new Coordinate(1, 7), buildingTypes.House, 0),
    new Building(new Coordinate(1, 8), new Coordinate(1, 8), buildingTypes.House, 0),
    new Building(new Coordinate(2, 8), new Coordinate(2, 8), buildingTypes.House, 0),
    new Building(new Coordinate(3, 7), new Coordinate(3, 7), buildingTypes.House, 0),
    new Building(new Coordinate(15, 7), new Coordinate(15, 7), buildingTypes.House, 0),
    new Building(new Coordinate(15, 8), new Coordinate(15, 8), buildingTypes.House, 0),
    new Building(new Coordinate(15, 9), new Coordinate(15, 9), buildingTypes.House, 0),
    new Building(new Coordinate(15, 10), new Coordinate(15, 10), buildingTypes.House, 0),
    new Building(new Coordinate(16, 8), new Coordinate(16, 8), buildingTypes.House, 0),
    new Building(new Coordinate(16, 10), new Coordinate(16, 10), buildingTypes.House, 0),
    new Building(new Coordinate(16, 11), new Coordinate(16, 11), buildingTypes.House, 0),
    new Building(new Coordinate(16, 12), new Coordinate(16, 12), buildingTypes.House, 0),
    new Building(new Coordinate(9, 10), new Coordinate(9, 10), buildingTypes.House, 0),
    new Building(new Coordinate(10, 10), new Coordinate(10, 10), buildingTypes.House, 0),
    new Building(new Coordinate(8, 14), new Coordinate(8, 14), buildingTypes.House, 0),
    new Building(new Coordinate(9, 14), new Coordinate(9, 14), buildingTypes.House, 0),
    new Building(new Coordinate(4, 18), new Coordinate(4, 18), buildingTypes.House, 0),
    new Building(new Coordinate(3, 19), new Coordinate(3, 19), buildingTypes.House, 0),
    new Building(new Coordinate(3, 20), new Coordinate(3, 20), buildingTypes.House, 0),

    // Stores (3):
    new Building(new Coordinate(2, 7), new Coordinate(2, 7), buildingTypes.Store, 0),
    new Building(new Coordinate(16, 9), new Coordinate(16, 9), buildingTypes.Store, 0),
    new Building(new Coordinate(3, 18), new Coordinate(3, 18), buildingTypes.Store, 0),
    new Building(new Coordinate(10, 14), new Coordinate(10, 14), buildingTypes.Store, 0),
    new Building(new Coordinate(11, 10), new Coordinate(11, 10), buildingTypes.Store, 0),
    
    // Supermarkets (1):
    new Building(new Coordinate(7, 9), new Coordinate(8, 10), buildingTypes.SuperMarket, 0),
    
    // Parks (2):
    new Building(new Coordinate(8, 3), new Coordinate(12, 5), buildingTypes.Park, 0),
    new Building(new Coordinate(14, 13), new Coordinate(16, 15), buildingTypes.Park, 0),
    
    // GYM (1):
    new Building(new Coordinate(11, 6), new Coordinate(12, 7), buildingTypes.Gym, 0)
];
for(let i = 0; i < buildingList.length; i++) {
    buildingList[i].start.x -= 1;
    buildingList[i].start.y -= 1;
    buildingList[i].end.x -= 1;
    buildingList[i].end.y -= 1;
} // ovo je tu samo da bi koordinate bile od 0 do 19, inace nece trebati jer cemo vec tako generisati gradjevine
*/
// OVO IZNAD JE STARI KOD GDE JE BILA HARdKODOVANA VREDNOST ZA LISTU ZGRADA, A SAD SE POZIVA FUNKCIJA KOJA RANDOM GENERISE GRAD ZA POCETAK!!!

var buildingList = generateModule.generateBuildings();
// _______________________________________________________________________________________________

function getBuildings() {    
    return buildingList;
} // funkcija koja vraca listu gradjevina, sad je to iz ovog programa a kasnije ce biti iz baze podataka

function addBuilding(building) {
    buildingList.push(building);
    console.log('adding building', building);
    return building.type.cost;
} // dodaje gradjevinu na listu i vraca njenu cenu (to je mozda visak jer mislim da se nigde ne koristi, ali nema veze)

function upgradeBuilding(index, performUpgrade) {
    if(buildingList[index] === undefined) {
        return -1;
    } // the index that was passed is invalid (out of bounds)
    let currLevel = buildingList[index].level;
    let type = buildingList[index].type;

    if(buildingStats.get(type).length - 1 === currLevel) {
        return 0;
    } // already upgraded to max level
    
    let cost = buildingStats.get(type)[currLevel+1].cost;
    // here it should be checked if a building is a 'building' or a 'park' and the cost should be multiplied by the number of blocks it occupies!!!
    if(performUpgrade) {
        buildingList[index].level += 1;
    }
    return cost;
} // funkcija koja upgrade-uje gradjevinu na nekom indeksu ako je moguce i ako je performUpgrade true i na kraju vraca cenu toga

exports.getBuildings = getBuildings;
exports.addBuilding = addBuilding;
exports.upgradeBuilding = upgradeBuilding;
    // eksportovanje funkcia, klasa i objekata koji se koriste u drugim fajlovima