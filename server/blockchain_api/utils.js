const buildingsModule = require("../gameplay/building_stats");
const { Building, SpecialBuilding, Coordinate } = require("../gameplay/building_stats");
const dimensions = buildingsModule.buildingDimensions;

//#region FORMAT CHECKING

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
  if ((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < 20) === false) {
    coordinatesValid = false;
  }
  return coordinatesValid && typeValid; // vratice se true samo ako su oba uslova ispunjena
}

//#endregion

//#region CHECKING FOR OVERLAPS

function overlap(building1, building2) {
  if (
    building1.start.x > building2.end.x ||
    building2.start.x > building1.end.x ||
    building1.start.y > building2.end.y ||
    building2.start.y > building1.end.y
  ) {
    return false;
  } else {
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

//#endregion

//#region FORMATING CITY DATA

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
  let city = { buildings: [], specialBuildings: [] };
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
        new Coordinate(data.endx[i + data.numOfBuildings.toNumber()].toNumber(), data.endy[i + data.numOfBuildings.toNumber()].toNumber()),
        data.specialType[i],
        data.orientation[i + data.numOfBuildings.toNumber()].toNumber()
      )
    );
  }
  city.money = data.money.toNumber();
  // city.income = data.income.toNumber();
  city.owner = data.owner;
  city.incomesReceived = data.incomesReceived.toNumber();
  city.created = data.created;
  city.initialized = data.initialized;

  let people = calculatePeople(city);

  // the names of the fieds are different because it is how they were named in the frontend
  city.normal = people.normalPeople;
  city.educated = people.educatedPeople;
  city.normalWorkers = people.manualWorkers;
  city.educatedWorkers = people.officeWorkers;

  return city;
}

//#endregion

//#region IS SAME BUILDING

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
  } else {
    return false;
  }
}

//#endregion

exports.isBuildingFormat = isBuildingFormat;
exports.isSpecialBuildingFormat = isSpecialBuildingFormat;
exports.doesOverlap = doesOverlap;
exports.formatBuildingList = formatBuildingList;
exports.isSameBuilding = isSameBuilding;
