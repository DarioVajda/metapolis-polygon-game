// INICIJALIZACIJA PROGRAMA:
// Importovanje:
const buildingsModule = require('./building');
const Building = buildingsModule.Building;
const Coordinate = buildingsModule.Coordinate;

const mapModule = require('./map');
const MapLand = mapModule.MapLand;

const peopleModule = require('./people');

const incomeModule = require('./income');

// Konstante:
const mapDimensions = 20;
var buildings;
var people;
var map;
var income;

//___________________________________________________________________________
function main() {
    buildings = buildingsModule.getBuildings();
    map = mapModule.initializeMap(buildings, mapDimensions);
    people = peopleModule.countPeople(buildings, map);
    income = incomeModule.calculateIncome(people); // ova funkcija ne valjda jos
}
//___________________________________________________________________________
// Provera:
main();
// console.log(buildings);
// console.log(map);
// console.log(people);
console.log('total income: ' + income);