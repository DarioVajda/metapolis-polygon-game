const buildingsModule = require("../gameplay/building_stats");
const { Building, SpecialBuilding, Coordinate, specialTypes } = require("../gameplay/building_stats");
const dimensions = buildingsModule.buildingDimensions;

// #region FORMAT CHECKING

function contains(array, element) {
    let r = false;
    array.forEach((el) => {
        if (element[0] === el[0] && element[1] === el[1]) {
            r = true;
        }
    });
    return r;
} // pomocna funkcija koja proverava da li niz nizova sa 2 elementa sadrzi niz sa 2 elementa sa nekim konkretnim vrednostima

function isBuildingFormat(obj, mapDimensions) {
    let md = mapDimensions || { x: 20, y: 20 };
    // proverava se da li je format gradjevine ispravan, ako se budu menjala neka polja u klasi building onda ce i ovaj kod morati da se promeni malo
    if (
        obj.start === undefined ||
        obj.end === undefined ||
        typeof obj.start.x !== "number" ||
        typeof obj.start.y !== "number" ||
        typeof obj.end.x !== "number" ||
        typeof obj.end.y !== "number" ||
        typeof obj.type !== "string" ||
        typeof obj.level !== "number" ||
        typeof obj.orientation !== "number" ||
        typeof obj.id !== 'number' ||
        Object.values(obj).length !== 6 ||
        Object.values(obj.start).length !== 2 ||
        Object.values(obj.end).length !== 2
    ) {
        return false;
    }

    // orientation mora biti ceo broj od 1 do 4, u suprotnom se vraca false
    if (obj.orientation !== 4 && obj.orientation !== 3 && obj.orientation !== 2 && obj.orientation !== 1) {
        return false;
    }
    let typeValid = false;
    Object.values(buildingsModule.buildingTypes).forEach((type) => {
        if (type === obj.type) {
            typeValid = true;
        }
    }); // proverava se da li postoji tip gradjevine kao sto je onaj primljeni, ako ne postoji onda typeValid ostaje false

    // provera da li su sve koordinate unutar mape:
    let coordinatesValid = true;
    if ((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < md.x) === false) {
        coordinatesValid = false;
    }

    if ((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < md.y) === false) {
        coordinatesValid = false;
    }

    // proverava se da li su dimenzije gradjevine dobre za taj konkretan tip
    coordinatesValid = coordinatesValid && contains(dimensions.get(obj.type), [obj.end.x - obj.start.x + 1, obj.end.y - obj.start.y + 1]);

    return coordinatesValid && typeValid; // vratice se true samo ako su oba uslova ispunjena
}

function isSpecialBuildingFormat(obj) {
    if (
        obj.start === undefined ||
        obj.end === undefined ||
        typeof obj.start.x !== "number" ||
        typeof obj.start.y !== "number" ||
        typeof obj.end.x !== "number" ||
        typeof obj.end.y !== "number" ||
        typeof obj.type !== "string" ||
        typeof obj.orientation !== "number" ||
        typeof obj.id !== 'number' ||
        Object.values(obj).length !== 5 ||
        Object.values(obj.start).length !== 2 ||
        Object.values(obj.end).length !== 2
    ) {
        return false;
    } // proverava se da li je format gradjevine ispravan

    // orientation mora biti ceo broj od 1 do 4, u suprotnom se vraca false
    if (obj.orientation !== 4 && obj.orientation !== 2 && obj.orientation !== 2 && obj.orientation !== 1) {
        return false;
    }

    // let typeValid = false;
    // Object.values(buildingsModule.buildingTypes).forEach((type) => {
    //     if (type === obj.type) {
    //         typeValid = true;
    //     }
    // }); // proverava se da li postoji tip gradjevine kao sto je onaj primljeni, ako ne postoji onda typeValid ostaje false

    // provera da li su sve koordinate unutar mape:
    let coordinatesValid = true;
    if ((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < md.x) === false) {
        coordinatesValid = false;
    }
    if ((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < md.y) === false) {
        coordinatesValid = false;
    }
    // return coordinatesValid && typeValid; // vratice se true samo ako su oba uslova ispunjena
    return coordinatesValid; // vratice se true samo ako su oba uslova ispunjena
}

// #endregion

// #region CHECKING FOR OVERLAPS

function overlap(building1, building2) {
    if (
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

function doesOverlap(building, city) {
    let r = false;

    city.buildings.forEach((element) => {
        if (overlap(building, element)) {
            r = true;
        }
    });
    city.specialBuildings.forEach((element) => {
        if (overlap(building, element)) {
            r = true;
        }
    });
    return r;
} // funkcija kao argument prima gradjevinu i citav grad

// #endregion

// #region FORMATING CITY DATA

function calculatePeople(data) {
    // console.log(data);

    let buildings = data.buildings;

    let normalPeople = 0;
    let educatedPeople = 0;
    let manualWorkers = 0;
    let officeWorkers = 0;

    buildings.forEach((element) => {
        normalPeople += buildingsModule.buildingStats.get(element.type)[element.level].normalPeople;
        educatedPeople += buildingsModule.buildingStats.get(element.type)[element.level].educatedPeople;
        manualWorkers += buildingsModule.buildingStats.get(element.type)[element.level].manualWorkers;
        officeWorkers += buildingsModule.buildingStats.get(element.type)[element.level].officeWorkers;
    });

    return {
        normalPeople: normalPeople,
        educatedPeople: educatedPeople,
        manualWorkers: manualWorkers,
        officeWorkers: officeWorkers,
    }; // vraca se objekat sa ovim poljima i vrednostima
}

function formatBuildingList(data) {
    let city = { buildings: [], specialBuildings: [], specialBuildingCash: [] };
    // console.log(data);
    for (let i = 0; i < data.buildingList.length; i++) {
        city.buildings.push({
            start: { x: data.buildingList[i].startx, y: data.buildingList[i].starty },
            end: { x: data.buildingList[i].endx, y: data.buildingList[i].endy },
            type: data.buildingList[i].buildingType,
            level: data.buildingList[i].level,
            orientation: data.buildingList[i].orientation,
            id: data.buildingList[i].id
        });
    }
    for (let i = 0; i < data.specialBuildingList.length; i++) {
        city.specialBuildings.push({
            start: { x: data.specialBuildingList[i].startx, y: data.specialBuildingList[i].starty },
            end: { x: data.specialBuildingList[i].endx, y: data.specialBuildingList[i].endy },
            type: data.specialBuildingList[i].specialType,
            orientation: data.specialBuildingList[i].orientation,
            id: data.specialBuildingList[i].id
        });
    }

    city.specialBuildingCash = data.specialBuildingCash;

    city.money = data.money.toNumber();
    // city.income = data.income.toNumber();
    city.owner = data.cityOwner;
    city.incomesReceived = data.incomesReceived.toNumber();
    city.created = data.cityCreated;
    city.initialized = data.initialized;
    city.theme = data.theme;
    city.buildingId = parseInt(data.buildingId, 16),
    city.specialBuildingId = parseInt(data.specialBuildingId, 16);

    city.dimensions = data.dimensions || { x: 20, y: 20 };

    let people = calculatePeople(city);

    // the names of the fields are different because it is how they were named in the frontend
    city.normal = people.normalPeople;
    city.educated = people.educatedPeople;
    city.normalWorkers = people.manualWorkers;
    city.educatedWorkers = people.officeWorkers;
    
    // city.buildings = [];
    // city.specialBuildings = [];

    return city;
}

// #endregion

// #region IS SAME BUILDING

function isSameBuilding(building1, building2) {
    // console.log(building1.start.x + '  :  ' + building2.start.x)
    // console.log(building1.start.y + '  :  ' + building2.start.y)
    // console.log(building1.end.x + '  :  ' + building2.end.x)
    // console.log(building1.end.y + '  :  ' + building2.end.y)
    // console.log(building1.type + '  :  ' + building2.type)
    // console.log(building1.level + '  :  ' + building2.level)
    if (
        building1.start.x === building2.start.x &&
        building1.start.y === building2.start.y &&
        building1.end.x === building2.end.x &&
        building1.end.y === building2.end.y &&
        building1.type === building2.type &&
        building1.level === building2.level &&
        building1.orientation === building2.orientation
    ) {
        return true;
    }
    else {
        return false;
    }
}

// #endregion

// #region CHECKING OFFERS

function formatOffers(offers) {

    let typeData = Object.entries(offers).map(element => ({
        type: element[0],
        offers: element[1]
    }));

    let offerList = typeData
        .map((element) => ({ type: element.type, offers: element.offers }) ) // making an array with this format: [ {type: 'type', offers: [{value: x, user: id}] }, ... ]
        .reduce(
            (array, subarray) => array.concat(
                subarray.offers
                    .map((element, index) => ({ ...element, type: subarray.type, index: index }) ) // adding the index and type to all elements in the array
                    .filter((element) => element.user === id) // leaving only the offers this person made
            ),
            []
        ) // reducing the array with elements typeData to this format: [ {type, index, value, user}, ... ]
        .map((element) => ({ type: element.type, index: element.index, value: element.value, canceled: false }) ) // removing the 'user' field since it is unnecessary
    
    return offerList;
}

function reverseFormatOffers(offers, offersArg) {
    for(let i = 0; i < offers.length; i++) {
        if(offers[i].canceled === true) {
            offersArg[offers[i].type][offers[i].index].canceled = true;
        }
    }

    return offersArg;
}

function checkingOffers(offersArg, cityData, moneyValue) {

    let offers = formatOffers(offersArg);

    let totalOfferValue = offers.reduce((sum, element) => {
        if(element.canceled === false) return sum + element.value;
        else return sum;
    }, 0); // calculating the sum of all the offers the person made

    // cancel the offers that should be canceled...
    let delta = cityData.money - moneyValue; // delta is the available money
    let numOfCanceledOffers = 0;

    // pushing the offers that should be canceled to a list until it is not needed anymore
    while(delta < totalOfferValue) {
        totalOfferValue -= offers[numOfCanceledOffers].canceled === false ? offers[numOfCanceledOffers].value : 0; // decreasing the total value of offers (if curr offer is not canceled already)
        offers[numOfCanceledOffers].canceled = true;
        numOfCanceledOffers++;
    }

    offersArg = reverseFormatOffers(offers, offersArg);
    
    return offersArg;
}

async function cancelOffers(offersArg) {
    // canceling the offers where 'canceled' is true...
}

// #endregion

exports.checkingOffers = checkingOffers;
exports.cancelOffers = cancelOffers;

exports.isBuildingFormat = isBuildingFormat;
exports.isSpecialBuildingFormat = isSpecialBuildingFormat;
exports.doesOverlap = doesOverlap;
exports.formatBuildingList = formatBuildingList;
exports.isSameBuilding = isSameBuilding;