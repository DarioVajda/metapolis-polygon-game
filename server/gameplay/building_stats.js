class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} // klasa koja sadrzi x i y koordinate, koristi se za polozaj gradjevina

//#region BUILDINGS

class Building {
    constructor(start, end, type, level, orientation, id) {
        this.start = start; // coordinate
        this.end = end; // coordinate
        this.type = type; // jedan od stringova iz buildingTypes objekta
        this.level = level; // int koji oznacava level gradjevine
        this.orientation = orientation;
        this.id = id;
    }
} // klasa koja opisuje jednu gradjevinu

// #region Themes

const themes = [
    'snow',
    'forest',
    'beach',
    'desert',
    'space',
    'fire',
    'highTech',
    'pixelized',
]

// #endregion

// _______________________________________________________________________________________________
// tipovi gradjevina:
const buildingTypes = { //zamenio sam ovde neki redosled jbg
    House: 'house',
    Building: 'building',
    Factory: 'factory',
    Office: 'office',
    Restaurant: 'restaurant',
    Parking: 'parking',
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
        for(let j = i; j <= max; j++) {
            r.push([i, j]);
        }
    }
    return r;
} // funkcija koja napravi niz svih mogucih parova mxn gde su m i n izmedju min i max (ukljucujuci i njih)
function initBuildingDimensions() {
    // ova funkcija je tu samo da bude lepse, a kasnije se poziva da bi se sve ovo izvrsilo
    buildingDimensions.set(buildingTypes.Factory, [[2, 4]]);
    buildingDimensions.set(buildingTypes.Office, [[2, 2]]);
    buildingDimensions.set(buildingTypes.Restaurant, [[1, 2]]);
    buildingDimensions.set(buildingTypes.Parking, dimensionsRange(2, 4));
    buildingDimensions.set(buildingTypes.Building, [[1, 3], [2, 2]]);
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
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 50, officeWorkers: 15, radius: 15, maxDecrease: 0.2},
        { cost: 2000000, normalPeople: 0, educatedPeople: 0, manualWorkers: 70, officeWorkers: 30, radius: 15, maxDecrease: 0.1}
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
        { cost: 20000, normalPeople: 2, educatedPeople: 3, manualWorkers: 0, officeWorkers: 0, boost: 1.3},
        { cost: 30000, normalPeople: 4, educatedPeople: 7, manualWorkers: 0, officeWorkers: 0, boost: 1.4},
        { cost: 40000, normalPeople: 8, educatedPeople: 12, manualWorkers: 0, officeWorkers: 0, boost: 1.5}
    ]);
    buildingStats.set(buildingTypes.Store, [
        { cost: 100000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 2, maxDecrease: 0.3}
    ]);
    buildingStats.set(buildingTypes.SuperMarket, [
        { cost: 300000, normalPeople: 0, educatedPeople: 0, manualWorkers: 30, officeWorkers: 10, range: 3, maxDecrease: 0.3}
    ]);
    buildingStats.set(buildingTypes.Park, [
        { cost: 30000, normalPeople: 0, educatedPeople: 0, manualWorkers: 0, officeWorkers: 0, range: 0, boost: 1.2}
    ]);
    buildingStats.set(buildingTypes.Gym, [
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 10, officeWorkers: 0, range: 3, boost: 1.3},
        { cost: 400000, normalPeople: 0, educatedPeople: 0, manualWorkers: 15, officeWorkers: 0, range: 4, boost: 1.6}
    ]);
} // funkcija koja inicijalizuje polja u mapi
initBuildingStats();

//#endregion

//#region SPECIAL BUILDINGS
class SpecialBuilding {
    constructor(start, end, type, orientation, id) {
        this.start = start; // coordinate
        this.end = end; // coordinate
        this.type = type; // string representing the special building
        this.orientation = orientation;
        this.id = id;
    }
}

const specialTypes = {
    statue: {
        type: 'statue',
        count: 10,
        rarity: 5
    },
    fountain: {
        type: 'fountain',
        count: 20,
        rarity: 3
    },
    stadium: {
        type: 'stadium',
        count: 1,
        rarity: 10
    },
    school: { // nagrada da bude educated boost
        type: 'school',
        count: 10,
        rarity: 5
    },
    shoppingmall: { // nagrada da budu ingame pare npr
        type: 'shoppingmall',
        count: 10,
        rarity: 5
    },
    promenade: { // nagrada da bude novac jer 'se turistima dopada grad zbog setalista'
        type: 'promenade',
        count: 20,
        rarity: 3
    },
    townhall: { // nagrada da bude novac jer 'se turistima dopada grad zbog gradske kuce'
        type: 'townhall',
        count: 50,
        rarity: 2
    },

    eifelTower: {
        type: 'eifelTower',
        count: 50,
        rarity: 2
    },
    bigBen: {
        type: 'bigBen',
        count: 50,
        rarity: 2
    },
    statueOfLiberty: {
        type: 'statueOfLiberty',
        count: 50,
        rarity: 2
    },
    stonehenge: {
        type: 'stonehenge',
        count: 50,
        rarity: 2
    },
    londonEye: {
        type: 'londonEye',
        count: 50,
        rarity: 2
    },
    pyramid: {
        type: 'pyramid',
        count: 50,
        rarity: 2
    },
    decorationTree: {
        type: 'decorationTree',
        count: 50,
        rarity: 2
    },
    spaceStation: {
        type: 'spaceStation',
        count: 50,
        rarity: 2
    },

    ...themes.reduce((prev, curr) => {
        let temp = { ...prev };
        temp[`${curr}Totem`] = {
            type: curr,
            count: 50,
            rarity: 2
        };
        return temp;
    }, {}),
}

const specialBuildingDimensions = new Map();
function initSpecialBuildingDimensions() {
    specialBuildingDimensions.set( specialTypes.statue.type,            [[1, 1]] );
    specialBuildingDimensions.set( specialTypes.fountain.type,          [[1, 2]] );
    specialBuildingDimensions.set( specialTypes.stadium.type,           [[2, 2]] );
    specialBuildingDimensions.set( specialTypes.school.type,            [[1, 2]] );
    specialBuildingDimensions.set( specialTypes.shoppingmall.type,      [[2, 2]] );
    specialBuildingDimensions.set( specialTypes.promenade.type,         [[1, 4]] );
    specialBuildingDimensions.set( specialTypes.townhall.type,          [[1, 3]] );
    
    specialBuildingDimensions.set( specialTypes.eifelTower.type,        [[2, 2]] );
    specialBuildingDimensions.set( specialTypes.bigBen.type,            [[1, 2]] );
    specialBuildingDimensions.set( specialTypes.statueOfLiberty.type,   [[1, 1]] );
    specialBuildingDimensions.set( specialTypes.stonehenge.type,        [[1, 2]] );
    specialBuildingDimensions.set( specialTypes.londonEye.type,         [[1, 2]] );
    specialBuildingDimensions.set( specialTypes.pyramid.type,           [[2, 2]] );
    specialBuildingDimensions.set( specialTypes.decorationTree.type,    [[1, 1]] );
    specialBuildingDimensions.set( specialTypes.spaceStation.type,      [[2, 3]] );

    themes.forEach((element) => {
        specialBuildingDimensions.set(element, [[1, 1]]);
    })
}
initSpecialBuildingDimensions();

const specialPrices = new Map();
function initSpecialPrices() {
    specialPrices.set(specialTypes.statue.type,         10  );
    specialPrices.set(specialTypes.fountain.type,       80000   );
    specialPrices.set(specialTypes.stadium.type,        1000000 );
    specialPrices.set(specialTypes.school.type,         200000  );
    specialPrices.set(specialTypes.shoppingmall.type,   750000  );
    specialPrices.set(specialTypes.promenade.type,      400000  );
    specialPrices.set(specialTypes.townhall.type,       1250000 );
}
initSpecialPrices();

//#endregion

exports.buildingTypes = buildingTypes;
exports.buildingStats = buildingStats;
exports.buildingDimensions = buildingDimensions;

exports.specialTypes = specialTypes;
exports.specialPrices = specialPrices;
exports.specialBuildingDimensions = specialBuildingDimensions;

exports.Building = Building;
exports.SpecialBuilding = SpecialBuilding;
exports.Coordinate = Coordinate;