const statsModule = require('../gameplay/building_stats');
const types = statsModule.buildingTypes;
const Building = statsModule.Building;
const Coordinate = statsModule.Coordinate;
const buildingDimensions = statsModule.buildingDimensions;
const mapModule = require('../gameplay/map');
const mapDimensions = mapModule.mapDimensions;

// RANDOM FUNCTIONS:
function random(min, max) {
    let r = 0;
    r = Math.random();
    r *= max - min + 1;
    r = Math.floor(r);
    r += min;
    return r;
}

function randomPick(choises) {
    let temp = [...choises];
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
function numOfBuildings(probabilities) {
    let num = [];
    for(let i = 0; i < Object.values(types).length; i++) {
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
        buildings.forEach(element => {
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
    if(direction === 0) {
        end.x = start.x + (shape[0] - 1); // kraj gradjevine ce se nalaziti desno za shape[0]
        end.y = start.y + (shape[1] - 1); // kraj gradjevine ce se nalaziti dole za shape[1]
    }
    else if(direction === 1) {
        end.x = start.x; // kraj gradjevine ce se nalaziti tamo gde nam je trenutno start.x
        end.y = start.y + (shape[1] - 1); // kraj gradjevine ce se nalaziti dole za shape[1]
        start.x = start.x - (shape[0] - 1); // pocetak gradjevine se nalazi za shape[0] levo
    }
    else if(direction === 2) {
        end.x = start.x; // generisane koordinate postaju koordinate kraja gradjevine
        end.y = start.y; // generisane koordinate postaju koordinate kraja gradjevine
        start.x = start.x - (shape[0] - 1); // pocetne koordinate se pomeraju za shape[0]
        start.y = start.y - (shape[1] - 1); // pocetne koordinate se pomeraju za shape[1]
    }
    else {
        end.x = start.x + (shape[0] - 1);
        end.y = start.y;
        start.y = start.y - (shape[1] - 1);
    }
}

function createBuilding(buildings, type) {
    let building = new Building(new Coordinate(-1, -1), new Coordinate(-1, -1), type, 0);

    let start = new Coordinate(0, 0);
    let end = new Coordinate(0, 0);


    while(buildingValid(buildings, building) === false) {
        start.x = random(0, mapDimensions - 1);
        start.y = random(0, mapDimensions - 1);

        let shape = random(0, buildingDimensions.get(type).length - 1);
        let direction = random(0, 3);
        // shape odredjuje koji od oblika ce biti gradjevina ako ih postoji vise
        //direction odredjuje u kom ce smeru biti okrenuta zgrada, start koordinata moze da bude levo-gore(0), desno-gore(1), desno-dole(2) ili levo-dole(3)
        
        calculateCoordinates(start, end, buildingDimensions.get(type)[shape], direction);

        building.start = start;
        building.end = end;
    } // generisu se random koordinate za levi gornji cosak gradjevine

    buildings.push(building);
}

//________________________________________________________________________________________________
function generate() {
    var buildings = [];
    var probabilities = [
        [[1, 1]],
        [[1, 1]],
        [[0, 1]],
        [[0, 1]],
        [[1, 19], [2, 1]],
        [[3, 90], [4, 9], [5, 1]],
        [[1, 9], [2, 1]],
        [[0, 49], [1, 1]],
        [[1, 7], [2, 3]],
        [[1, 49], [1, 1]]
    ];
    num = numOfBuildings(probabilities);

    
    for(let i = 0; i < num.length; i++) {
        while(num[i] > 0) {
            createBuilding(buildings, Object.values(types)[i]);
            num[i]--;
        }
    }
    return buildings;
}

generate();

exports.generateBuildings = generate;