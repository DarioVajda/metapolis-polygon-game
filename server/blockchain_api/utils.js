const buildingsModule = require('../gameplay/building');
const dimensions = buildingsModule.buildingDimensions;

function contains(array, element) {
    let r = false;
    array.forEach((el) => {
        if(element[0] === el[0] && element[1] === el[1]) {
            r = true;
        }
    });
    return r;
} // pomocna funkcija koja proverava da li niz nizova sa 2 elementa sadrzi niz 
// sa 2 elementa sa nekim konkretnim vrednostima

function isBuildingFormat(obj) {
    if(
        obj.start === undefined ||
        obj.end === undefined ||
        typeof obj.start.x !== 'number' ||
        typeof obj.start.y !== 'number' ||
        typeof obj.end.x !== 'number' ||
        typeof obj.end.y !== 'number' ||
        typeof obj.type !== 'string' ||
        typeof obj.level !== 'number' ||
        Object.values(obj).length !== 4 ||
        Object.values(obj.start).length !== 2 ||
        Object.values(obj.end).length !== 2

    ) {
        return false;
    } // proverava se da li je format gradjevine ispravan, ako se budu menjala neka polja u klasi
    // building onda ce i ovaj kod morati da se promeni malo

    let typeValid = false;
    Object.values(buildingsModule.buildingTypes).forEach(type => {
        if(type === obj.type) {
            typeValid = true;
        }
    }); // proverava se da li postoji tip gradjevine kao sto je onaj primljeni, ako ne postoji
    // onda typeValid ostaje false

     // provera da li su sve koordinate unutar mape:
    let coordinatesValid = true;
    if((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < 20) === false) {
        coordinatesValid = false;
    }
    if((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < 20) === false) {
        coordinatesValid = false;
    }
    
    coordinatesValid = coordinatesValid && contains(dimensions.get(obj.type), [obj.end.x - obj.start.x + 1, obj.end.y - obj.start.y + 1]);
        // proverava se da li su dimenzije gradjevine dobre za taj konkretan tip

    return coordinatesValid && typeValid; // vratice se true samo ako su oba uslova ispunjena
}

function doesOverlap(building, map) {
    for(let i = building.start.x; i <= building.end.x; i++) {
        for(let j = building.start.y; j <= building.end.y; j++) {
            if(map[j][i] !== undefined && map[j][i].occupiedBy !== null) {
                return true;
            }
        }
    }
    return false;
} // funkcija kao argument primi mapu koja je matrica i svaki element sadrzi polje 'occupiedBy'
// i proverava se da li je neko od polja vec zauzeto, ako jeste vraca se true

exports.isBuildingFormat = isBuildingFormat;
exports.doesOverlap = doesOverlap;
    // exportovanje funkcija