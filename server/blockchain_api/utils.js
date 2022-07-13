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

function isBuildingFormat(obj) {
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
        Object.values(obj).length !== 5 ||
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
    if ((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < 20) === false) {
        coordinatesValid = false;
    }

    if ((0 && obj.start.y <= obj.end.y && obj.end.y < 20) === false) {
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
        Object.values(obj).length !== 4 ||
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
    if ((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < 20) === false) {
        coordinatesValid = false;
    }
    if ((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < 20) === false) {
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
    for (let i = 0; i < data.numOfBuildings; i++) {
        city.buildings.push(
            new Building(
                new Coordinate(data.startx[i].toNumber(), data.starty[i].toNumber()),
                new Coordinate(data.endx[i].toNumber(), data.endy[i].toNumber()),
                data.buildingType[i],
                data.level[i].toNumber(),
                data.orientation[i].toNumber()
            )
        );
    }
    for (let i = 0; i < data.numOfSpecialBuildings; i++) {
        city.specialBuildings.push(
            new SpecialBuilding(
                new Coordinate(
                    data.startx[i + data.numOfBuildings.toNumber()].toNumber(),
                    data.starty[i + data.numOfBuildings.toNumber()].toNumber()
                ),
                new Coordinate(
                    data.endx[i + data.numOfBuildings.toNumber()].toNumber(),
                    data.endy[i + data.numOfBuildings.toNumber()].toNumber()
                ),
                data.specialType[i],
                data.orientation[i + data.numOfBuildings.toNumber()].toNumber()
            )
        );
    }

    city.specialBuildingCash = data.specialBuildingCash;

    city.money = data.money.toNumber();
    // city.income = data.income.toNumber();
    city.owner = data.owner;
    city.incomesReceived = data.incomesReceived.toNumber();
    city.created = data.created;
    city.initialized = data.initialized;

    let people = calculatePeople(city);

    // the names of the fields are different because it is how they were named in the frontend
    city.normal = people.normalPeople;
    city.educated = people.educatedPeople;
    city.normalWorkers = people.manualWorkers;
    city.educatedWorkers = people.officeWorkers;

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

/**
 * Function that checks if a player can spend some ingame money without affecting the offers the person made
 * If it affects any of the offers with this action, some offers will be canceled
 * @param {'smart contract'} contract is connecting us to the Gameplay smart contract
 * @param {Number} id is the id of the player
 * @param {Number} moneyValue is the value someone is trying to spend
 * @param {Object?} cityData is the data about the city (optional, will be loaded if not provided)
 * @returns {{ success: Boolean, canceled: Array<{ type: String, index: Number }> }} list of offers that were canceled and a boolean indicating if the action was successful
 */
async function checkingOffers ({ contract, id, moneyValue, cityData }) {

    let cityDataLoaded = true;

    // async function used to load the data about a city
    const loadCityData = async () => {
        cityData = await contract.getCityData(id);
        cityData = formatBuildingList(cityData);
        cityDataLoaded = true;
    }

    // loading the data about the city if it was not provided
    if(cityData === undefined) {
        cityDataLoaded = false;
        loadCityData();
    }

    let typeData = []; // array of objects containing data about the special building types
    let typeList = Object.values(specialTypes); // array of strings
    let numOfTypes = typeList.length; // number of special building types

    // function called to load data about a special building type
    const loadTypeData = async (_type) => {
        let data = await contract.getSpecialBuildingType(_type);
        data.type = _type;
        typeData.push(data);
    }
    const delay = async (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    for(let i = 0; i < numOfTypes; i++) {
        // starting the async functions for all special building types
        loadTypeData(typeList[i]);
    }

    // waiting for all the data to load (city data and special building types)
    while(cityDataLoaded === false || typeData.length < numOfTypes) {
        await delay(50);
    }

    let offers = typeData
        .map((element) => ({ type: element.type, offers: element.offers }) ) // making an array with this format: [ {type: 'type', offers: [{value: x, user: id}] }, ... ]
        .reduce(
            (array, subarray) => array.concat(
                subarray.offers
                    .map((element, index) => ({ ...element, type: subarray.type, index: index }) ) // adding the index and type to all elements in the array
                    .filter((element) => element.user === id) // leaving only the offers this person made
            ),
            []
        ) // reducing the array with elements typeData to this format: [ {type, index, value, user}, ... ]
        .map((element) => ({ type: element.type, index: element.index, value: element.value }) ) // removing the 'user' field since it is unnecessary
    

    let totalOfferValue = offers.reduce((sum, element) => sum + element.value, 0); // calculating the sum of all the offers the person made

    if(cityData.money - moneyValue < totalOfferValue) {
        // cancel the offers that should be canceled...
        let delta = cityData.money - moneyValue; // delta is the available money
        let receipts = [];
        let error = false;
        let numOfCanceledOffers = 0;

        const cancel = async ({ type, index }) => {
            let tx = await contract.cancelSpecialOffer(type, index);
            try {
                let receipt = await tx.wait();
                receipts.push(receipt);
            }
            catch(e) {
                error = true;
                receipts.push(e);
            }
        }

        // calling the cancel function until it is not needed anymore
        while(delta < totalOfferValue) {
            totalOfferValue -= offers[numOfCanceledOffers].value; // decreasing the total value of offers
            numOfCanceledOffers++;
            cancel(offers[numOfCanceledOffers]); // canceling the offer
        }

        // waiting until all the offers that should be canceled are canceled
        while(error === false && receipts.length < numOfCanceledOffers) {
            await delay(50);
        }

        if(error === true) {
            return {
                success: false,
                canceled: []
            }; // indicating that something went wrong in the transactions
        }

        return {
            success: true,
            canceled: offers
                .slice(0, numOfCanceledOffers) // taking only the first 'numOfCanceledOffers' elements because those are the ones that were canceled
                .map(element => ({ type: element.type, index: element.index })) // removing the 'value' property
        };
    }
    else {
        return {
            success: true,
            canceled: []
        };
    }
}

// #endregion

exports.checkingOffers = checkingOffers;
exports.isBuildingFormat = isBuildingFormat;
exports.isSpecialBuildingFormat = isSpecialBuildingFormat;
exports.doesOverlap = doesOverlap;
exports.formatBuildingList = formatBuildingList;
exports.isSameBuilding = isSameBuilding;