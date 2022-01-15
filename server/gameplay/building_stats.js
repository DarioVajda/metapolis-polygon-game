class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} // klasa koja sadrzi x i y koordinate, koristi se za polozaj gradjevina

class Building {
    constructor(start, end, type, level) {
        this.start = start; // coordinate
        this.end = end; // coordinate
        this.type = type; // jedan od stringova iz buildingTypes objekta
        this.level = level; // int koji oznacava level gradjevine
    }
} // klasa koja opisuje jednu gradjevinu

// _______________________________________________________________________________________________
// tipovi gradjevina:
const buildingTypes = {
    Factory: 'factory',
    Office: 'office',
    Restaurant: 'restaurant',
    Parking: 'parking',
    Building: 'building',
    House: 'house',
    Store: 'store',
    SuperMarket: 'supermarket',
    Park: 'park',
    Gym: 'gym'
}
// _______________________________________________________________________________________________
// Dimenzije gradjevina:
const buildingDimensions = new Map();
function dimensionsRange(min, max) {
    let r = [];
    for(let i = min; i <= max; i++) {
        for(let j = min; j <= max; j++) {
            r.push([i, j]);
        }
    }
    return r;
} // funkcija koja napravi niz svih mogucih parova mxn gde su m i n izmedju min i max (ukljucujuci i njih)
function initBuildingDimensions() {
    // ova funkcija je tu samo da bude lepse, a kasnije se poziva da bi se sve ovo izvrsilo
    buildingDimensions.set(buildingTypes.Factory, [[2, 4], [4, 2]]);
    buildingDimensions.set(buildingTypes.Office, [[2, 2]]);
    buildingDimensions.set(buildingTypes.Restaurant, [[2, 1], [1, 2]]);
    buildingDimensions.set(buildingTypes.Parking, dimensionsRange(2, 4));
    buildingDimensions.set(buildingTypes.Building, [[1, 3], [3, 1], [2, 2]]);
    buildingDimensions.set(buildingTypes.House, [[1, 1]]);
    buildingDimensions.set(buildingTypes.Store, [[1, 1]]);
    buildingDimensions.set(buildingTypes.SuperMarket, [[2, 2]]);
    buildingDimensions.set(buildingTypes.Park, dimensionsRange(2, 5));
    buildingDimensions.set(buildingTypes.Gym, [[2, 2]]);
} // funkcija koja inizijalizuje moguce vrednosti dimenzija svakih gradjevina, ovo moze da se menja
initBuildingDimensions();
// _______________________________________________________________________________________________
// ovo su osobine gradjevina - ljudi, radna mesta, cene, nivoi,...
const buildingStats = new Map();
function initBuildingStats() {
    // Sve ovo je u funkciji da bi program bio lepsi, a kasnije se poziva da se sve ovo izvrsi
    buildingStats.set(buildingTypes.Factory, [
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15, radius: 10, maxDecrease: 0.15},
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 70, officeWorkers: 30, radius: 10, maxDecrease: 0.1}
    ]);
    buildingStats.set(buildingTypes.Office, [
        { cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 25},
        { cost: 1500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 40}
    ]);
    buildingStats.set(buildingTypes.Restaurant, [
        { cost: 500000, normalPeople: 0, educatedPeople: 0, manualWorkers: 20, officeWorkers: 5}
    ]);
    buildingStats.set(buildingTypes.Parking, [
        { cost: 50000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0},
    ]);
    buildingStats.set(buildingTypes.Building, [
        { cost: 40000, normalPeople: 8, educatedPeople: 2, manualWorkers: 0, officeWorkers: 0},
        { cost: 40000, normalPeople: 20, educatedPeople: 5, manualWorkers: 0, officeWorkers: 0}
    ]);
    buildingStats.set(buildingTypes.House, [
        { cost: 200000, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0, boost: 1.2},
        { cost: 200000, normalPeople: 4, educatedPeople: 7, manualWorkers: 0, officeWorkers: 0, boost: 1.2}
    ]);
    buildingStats.set(buildingTypes.Store, [
        { cost: 100000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 2, maxDecrease: 0.3}
    ]);
    buildingStats.set(buildingTypes.SuperMarket, [
        { cost: 300000, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10, range: 3, maxDecrease: 0.3}
    ]);
    buildingStats.set(buildingTypes.Park, [
        { cost: 30000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0, range: 0}
    ]);
    buildingStats.set(buildingTypes.Gym, [
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 3},
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 15, officeWorkers: 0, range: 4}
    ]);
} // funkcija koja inicijalizuje polja u mapi
initBuildingStats();

exports.buildingTypes = buildingTypes;
exports.buildingStats = buildingStats;
exports.buildingDimensions = buildingDimensions;
exports.Building = Building;
exports.Coordinate = Coordinate;