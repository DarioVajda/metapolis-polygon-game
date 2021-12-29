// PROGRAM INITILIZATION:
// Imports:
const buildingsModule = require('./building');
const Building = buildingsModule.Building;
const Coordinate = buildingsModule.Coordinate;

const mapModule = require('./map');
const MapLand = mapModule.MapLand;

const peopleModule = require('./people');

const incomeModule = require('./income');

const prompt = require('prompt-sync')({sigint: true});

// Main Variables:
const mapDimensions = 20;
var buildings = buildingsModule.getBuildings();
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
function print(a, b, c, d) {
    if(a) console.log(buildings);
    if(b) console.log(map);
    if(c) console.log('people: ', people);
    if(d) console.log('total income: ' + income);
}
//___________________________________________________________________________
// Main program:
function testing() {
    input = prompt('Sta zelis da radis? (0 - izlaz, 1 - gradjenje, 2 - upgradeovanje...) ');
    if(input == 0) return;
    else if(input == 1) {
        console.log('Ovo su mogucnosti za izgradnju: (unesi indeks od 0 do 9)');
        console.log(Object.keys(buildingsModule.buildingTypes));
        var type = prompt('');
        var start = new Coordinate(0, 0);
        start.x = prompt('start.x = ');
        start.y = prompt('start.y = ');
        var end = new Coordinate(0, 0);
        end.x = prompt('end.x = ');
        end.y = prompt('end.y = ');
        buildingsModule.addBuilding(new Building(
            start,
            end,
            Object.values(buildingsModule.buildingTypes)[type][0]
        ));
    }
    else if(input == 2) {
        console.log('Ovo su gradjevine: (unesi indeks od 0...)');
        // console.log(buildings);
        var index = prompt('Unesi indeks gradjevine koju zelis da promenis: ');
        buildingsModule.upgradeBuilding(index);
    }
    else {
        console.log('Greska!');
    }
    main();
    print(false, false, false, true);
    testing();
}
/* Test primer (ovo treba da bude input): 
1 5 3 6 3 6 1 5 4 6 4 6 0
*/

main();
print(false, false, false, true);
// testing();