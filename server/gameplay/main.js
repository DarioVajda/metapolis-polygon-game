// PROGRAM INITILIZATION:
// Imports:
const prompt = require('prompt-sync')({sigint: true}); // import for console input

const buildingsModule = require('./building');

const statsModule = require('./building_stats');
const Coordinate = statsModule.Coordinate;
const buildingStats = statsModule.buildingStats;

const mapModule = require('./map');

const peopleModule = require('./people');

const incomeModule = require('./income');

const moneyModule = require('./money');

const generateModule = require('../rand_map/generate');

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
} // racuna sve sto treba da se izracuna
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
        console.log(Object.values(statsModule.buildingTypes));
        var type = prompt('');
        type = Object.values(statsModule.buildingTypes)[type];
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
        var enoughMoney = moneyModule.changeMoneyValue(-buildingsModule.upgradeBuilding(index, false));
        if(enoughMoney) buildingsModule.upgradeBuilding(index, true);
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
    print(false, false, false, true, true);
    testing();
} // ovo me mrzi da opisujem ali nije ni bitno

main();
print(false, false, false, true, true);
testing();

/*
var maks = 0;
var min = 9999999999;
const it = 1000000;
var sum = 0;
for(let i = 0; i < it; i++) {
    buildings = generateModule.generateBuildings();
    map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
    people = peopleModule.countPeople(buildings, map);
    income = incomeModule.calculateIncome(people, buildings);
    income /= 10000;
    // console.log(income);
    if(income > maks) {
        maks = income;
    }
    if(income < min) {
        min = income;
    }
    sum += income;

    if(i % 100 === 0) console.log(income);
}
console.log('max income:', maks);
console.log('min income:', min);
console.log('avg income:', sum / it);

/*
Rezultati za 100000 gradova:
    max income: 79.7108
    min income: 20.3309
    avg income: 32.1703919670999
    * sve je podeljeno sa 10000 *
*/