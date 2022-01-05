// PROGRAM INITILIZATION:
// Imports:
const prompt = require('prompt-sync')({sigint: true}); // import for console input

const buildingsModule = require('./building');
const Building = buildingsModule.Building;
const Coordinate = buildingsModule.Coordinate;
const buildingStats = buildingsModule.buildingStats;

const mapModule = require('./map');

const peopleModule = require('./people');

const incomeModule = require('./income');

const moneyModule = require('./money');

// Main Variables:
var buildings = buildingsModule.getBuildings();
var people;
var map;
var income;
//___________________________________________________________________________
function main() {
    buildings = buildingsModule.getBuildings();
    map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
    people = peopleModule.countPeople(buildings, map);
    income = incomeModule.calculateIncome(people, buildings);
}
function print(a, b, c, d, e) {
    if(a) console.log(buildings);
    if(b) console.log(map);
    if(c) console.log('people: ', people);
    if(d) console.log('total income: ' + income);
    if(e) console.log('total money is: ' + moneyModule.getMoneyValue());
}
//___________________________________________________________________________
// Main program:
function testing() {
    input = prompt('Sta zelis da radis? (0 - izlaz, 1 - gradjenje, 2 - upgradeovanje, 3 - dobij plate...) ');
    if(input == 0) return;
    else if(input == 1) {
        console.log('Ovo su mogucnosti za izgradnju: (unesi indeks)');
        console.log(Object.values(buildingsModule.buildingTypes));
        var type = prompt('');
        type = Object.values(buildingsModule.buildingTypes)[type];
        var start = new Coordinate(0, 0);
        start.x = prompt('start.x = ');
        start.y = prompt('start.y = ');
        var end = new Coordinate(0, 0);
        end.x = prompt('end.x = ');
        end.y = prompt('end.y = ');
        console.log(type);

        var success = moneyModule.changeMoneyValue(- buildingStats.get(type)[0].cost);
        if(success === true) {
            buildingsModule.addBuilding(new Building(start, end, type, 0));
        }
    }
    else if(input == 2) {
        console.log('Ovo su gradjevine: (unesi indeks od 0...)');
        // console.log(buildings);
        var index = prompt('Unesi indeks gradjevine koju zelis da promenis: ');
        moneyModule.changeMoneyValue(-buildingsModule.upgradeBuilding(index));
    }
    else if(input == 3) {
        moneyModule.changeMoneyValue(income);
    }
    else {
        console.log('Greska!');
        testing();
        return;
    }
    main();
    print(false, false, false, false, true);
    testing();
}
/* Test primer (ovo treba da bude input): 
1 5 3 6 3 6 1 5 4 6 4 6 0
*/

main();
print(false, false, false, false, true);
testing();