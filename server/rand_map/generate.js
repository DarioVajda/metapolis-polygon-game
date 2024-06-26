const statsModule = require('../gameplay/building_stats');
const types = statsModule.buildingTypes;
const specialTypes = Object.values(statsModule.specialTypes).map(element => element.type);
const Building = statsModule.Building;
const SpecialBuilding = statsModule.SpecialBuilding;
const Coordinate = statsModule.Coordinate;
const buildingDimensions = statsModule.buildingDimensions;
const specialBuildingDimensions = statsModule.specialBuildingDimensions;
const mapModule = require('../gameplay/map');
const mapDimensions = mapModule.mapDimensions;
const calculateCoordinatesImport = require('../gameplay/coordinates').calculateCoordinates;

// RANDOM FUNCTIONS:
function random(min, max) {
    let r = 0;
    r = Math.random();
    r *= max - min + 1;
    r = Math.floor(r);
    r += min;
    return r;
}

function randomPick(choices) {
    let temp = [...choices];
    let sum = 0;
    for(let i = 0; i < temp.length; i++) {
        sum += temp[i][1];
        if(i > 0) {
            temp[i][1] += temp[i-1][1];
        }
    }
    const r = random(1, sum);
    let pick;
    for(let i = 0; i < temp.length; i++) {
        if(r <= temp[i][1]) {
            pick = temp[i][0];
            break;
        }
    }
    return pick;
}
// ________________________________________________________________________________________________
// NUMBER OF BUILDINGS:
function numOfBuildings(probabilities, normal) {
    let num = [];
    let n = (normal) ? Object.values(types).length : Object.values(specialTypes).length;
    for(let i = 0; i < n; i++) {
        num.push(randomPick(probabilities[i]));
    }

    return num;
}
// ________________________________________________________________________________________________
// CREATE BUILDING:
function doOverlap(building1, building2) {
    if(
        building1.start.x > building2.end.x ||
        building2.start.x > building1.end.x ||
        building1.start.y > building2.end.y ||
        building2.start.y > building1.end.y
    ) {
        return false;
    }
    else {
        return true;
    }
}

function buildingValid(buildings, building) {
    if(
        building.start.x >= 0 &&
        building.start.y >= 0 &&
        building.end.x < 20 &&
        building.end.y < 20
    ) {
        let valid = true;
        buildings.normal.forEach(element => {
            if(doOverlap(building, element)) {
                valid = false;
            }
        });
        buildings.special.forEach(element => {
            if(doOverlap(building, element)) {
                valid = false;
            }
        });
        return valid;
    }
    else {
        return false;
    }
}

function calculateCoordinates(start, end, shape, direction) {
    let r = calculateCoordinatesImport(shape, direction, start);
    start.x = r.start.x;
    start.y = r.start.y;
    end.x = r.end.x;
    end.y = r.end.y;
}

function createBuilding(buildings, type, normal) {
    let building;
    if(normal) building = new Building(new Coordinate(-1, -1), new Coordinate(-1, -1), type, 0);
    else building = new SpecialBuilding(new Coordinate(-1, -1), new Coordinate(-1, -1), type);

    let start = new Coordinate(0, 0);
    let end = new Coordinate(0, 0);

    let tempDimensions = normal ? buildingDimensions : specialBuildingDimensions;

    while(buildingValid(buildings, building) === false) {
        start.x = random(0, mapDimensions - 1);
        start.y = random(0, mapDimensions - 1);

        let shape = random(0, tempDimensions.get(type).length - 1);
        let direction = random(0, 3);
        // shape odredjuje koji od oblika ce biti gradjevina ako ih postoji vise
        //direction odredjuje u kom ce smeru biti okrenuta zgrada, start koordinata moze da bude levo-gore(0), desno-gore(1), desno-dole(2) ili levo-dole(3)
        
        calculateCoordinates(start, end, tempDimensions.get(type)[shape], direction);

        building.start = start;
        building.end = end;
        building.orientation = direction + 1;
    } // generisu se random koordinate za levi gornji cosak gradjevine

    if(normal) buildings.normal.push(building);
    else buildings.special.push(building);
}

//________________________________________________________________________________________________
function generate() {
    var buildings = {normal: [], special: []};
    
    // [num, chance]
    const probabilities = [
        [[3, 90], [4, 9], [5, 1]], // house
        [[1, 19], [2, 1]], // building
        [[1, 1]], // factory
        [[1, 1]], // office
        [[0, 1]], // restaurant
        [[0, 1]], // parking
        [[2, 9], [3, 1]], // store
        [[0, 49], [1, 1]], // supermarket
        [[1, 7], [2, 3]], // park
        [[0, 49], [1, 1]] // gym
    ];
    let num = numOfBuildings(probabilities, true);
    for(let i = 0; i < num.length; i++) {
        while(num[i] > 0) {
            createBuilding(buildings, Object.values(types)[i], true);
            num[i]--;
        }
    }

    const specialProbabilities = [
        [[1, 1]], // statue
        [[1, 9], [2, 1]], // fountain
        [[0, 9], [1, 1]], // stadium
        [[0, 99], [1, 1]], // school
        [[0, 99], [1, 1]], // shoppingMall
        [[0, 1]], // promenade
        [[0, 1]], // townHall
    ];
    let specialNum = numOfBuildings(specialProbabilities, false);
    for(let i = 0; i < specialNum.length; i++) {
        while(specialNum[i] > 0) {
            createBuilding(buildings, Object.values(specialTypes)[i], false);
            specialNum[i]--;
        }
    }
    return buildings;
}

// #region tests 

// console.dir(generate(), {depth: null});

// function test() {
//     let iterations = 10000000;
//     let stadiums = 0;
//     for(let i = 0; i < iterations; i++) {
//         let buildings = generate();
//         let stadium = false;
//         buildings.special.forEach((element) => {
//             if(element.type === 'stadium') {
//                 stadium = true;
//             }
//         })
//         if(stadium) stadiums++;
//     }
//     console.log({iterations, stadiums});
//     return stadiums/iterations;
// }

// let temp = test();
// let count = 1;
// while(temp !== 0.1) {
//     count++;
//     temp = test();
// }
// console.log('it took', count, ' runs to get the perfect ratio');

// testira se racunanje zarade:
// const incomeModule = require('../gameplay/income');

// let income = 0;
// let max = 0, min = 1e10;
// let iterations = 10000;
// for(let i = 0; i < iterations; i++) {
//     let buildings = generate();
//     let temp = incomeModule.calculateIncome({ buildings: buildings.normal, specialBuildings: buildings.special }, []);
//     income += temp;
//     if(temp > max) max = temp;
//     if(temp < min) min = temp;
// }
// console.log({ average: Math.round(income/iterations), max, min });

// #endregion

exports.doOverlap = doOverlap;
exports.generateBuildings = generate;