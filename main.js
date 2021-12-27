// Importovanje:
const buildingsModule = require('./building');
const Building = buildingsModule.Building;
const Coordinate = buildingsModule.Coordinate;

const mapModule = require('./map');
const MapLand = mapModule.MapLand;

const peopleModule = require('./people');

//___________________________________________________________________________
// Bitne promenljive:
const mapDimensions = 20;
var buildings = buildingsModule.getBuildings();
var people = peopleModule.countPeople(buildings);
var map = mapModule.initializeMap(buildings, mapDimensions);
var income = buildingsModule.calculateIncome(buildings, mapDimensions); // ova funkcija ne valjda jos

//___________________________________________________________________________
// Provera:
// console.log(people);
// console.log(map);
// console.log(buildings);
// console.log('total income: ' + income);