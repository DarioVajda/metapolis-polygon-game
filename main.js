
const buildingsModule = require('./building');
const buildingTypes = buildingsModule.buildingTypes;
const Building = buildingsModule.Building;
const Coordinate = buildingsModule.Coordinate;

const mapModule = require('./map');
const MapLand = mapModule.MapLand;

// Bitne promenljive:
const mapDimensions = 20;
var buildings = buildingsModule.getBuildings();
var map = [];

map = mapModule.initializeMap(buildings, mapDimensions);

console.log(map);

var income = buildingsModule.calculateIncome(buildings);

// console.log(income);
// console.log(buildings);