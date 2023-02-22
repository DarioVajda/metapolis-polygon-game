const buildingsModule = require('./building_stats');
const buildingTypes = buildingsModule.buildingTypes;
const buildingStats = buildingsModule.buildingStats;

const achievementModule = require('../blockchain_api/achievements');

const mapModule = require('./map');
const peopleModule = require('./people');

const incomeRate = {
    educated: 10000,
    normal: 5000,
    gymIncomePerPerson: 150,
    restaurantIncomePerPerson: 200
}; // plate ljudi u gradu i zarada teretane i restorana (moglo bi da predstavlja na mesecnom nivou)

// #region utils

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
} // pomocna funkcija koja sortira mapu

function inRange(gym, building) {
    if(
        Math.min(Math.abs(gym.start.x - building.end.x), Math.abs(gym.end.x - building.start.x)) <= buildingStats.get(gym.type)[0].range &&
        Math.min(Math.abs(gym.start.y - building.end.y), Math.abs(gym.end.y - building.start.y)) <= buildingStats.get(gym.type)[0].range
    ) {
        return true;
    }
    return false;
} // funkcija odredjuje da li je building u range-u teretane, a to je neophodno za racunanje zarade teretane

function gymIncome(gym, buildings) {
    var r = 0;
    buildings.forEach((element) => {
        if(inRange(gym, element)) {
            r += (buildingStats.get(element.type)[0].normalPeople + buildingStats.get(element.type)[0].educatedPeople) * incomeRate.gymIncomePerPerson;
        }
    });
    return r;
} // funkcija koja racuna zaradu teretane u zavisnosti od toga koliko je ljudi u range-u

function restaurantIncome(people, n) {
    var numOfPeople = 0;
    [...people.normalPeople.values()].forEach((element) => {
        numOfPeople += element;
    });
    [...people.educatedPeople.values()].forEach((element) => {
        numOfPeople += element;
    });

    return numOfPeople * incomeRate.restaurantIncomePerPerson;
} // racuna se zarada restorana koja je proporcionalna broju gradjana u celom gradu

function calculate(peopleArg, buildings) {
    var educatedIncome = 0;
    var normalIncome = 0;
    var people = {
        normalPeople: new Map([...peopleArg.normalPeople]),
        educatedPeople: new Map([...peopleArg.educatedPeople]),
        manualWorkers: peopleArg.manualWorkers,
        officeWorkers: peopleArg.officeWorkers
    }; // kopiraju se vrednosti iz glavnog peopleArg objekta da se on ne bi promenio
    var temp = [...people.educatedPeople][0];
    
    // racuna se zarada radnika u kancelarijama
    while(people.officeWorkers > 0 && temp !== undefined) {
        if(people.officeWorkers < temp[1]) {
            educatedIncome += incomeRate.educated * people.officeWorkers * temp[0];
            people.educatedPeople.set(temp[0], temp[1] - people.officeWorkers);
            people.officeWorkers = 0;
        }
        else {
            educatedIncome += incomeRate.educated * temp[1] * temp[0];
            people.officeWorkers -= temp[1];
            people.educatedPeople.delete(temp[0]);
        }
        temp = [...people.educatedPeople][0];
    }
    // racuna se zarada fizikalaca
    // ako su preostali neki edukovani ljudi oni mogu i da fizikalisu 
    temp = [...people.educatedPeople][0];
    while(temp !== undefined) {
        if(people.normalPeople.has(temp[0])) {
            temp[1] += people.normalPeople.get(temp[0]);
            people.normalPeople.delete(temp[0]);
            people.normalPeople.set(temp[0], temp[1]);
        }
        else {
            people.normalPeople.set(temp[0], temp[1]);
        }
        people.educatedPeople.delete(temp[0]);
        temp = [...people.educatedPeople][0];
    } // dodaju se edukovani ljudi na listu needukovanih
    people.normalPeople = sortMap(people.normalPeople);
    temp = [...people.normalPeople][0];
    while(people.manualWorkers > 0 && temp !== undefined) {
        if(people.manualWorkers < temp[1]) {
            normalIncome += incomeRate.normal * people.manualWorkers * temp[0];
            people.normalPeople.set(temp[0], temp[1] - people.manualWorkers);
            people.manualWorkers = 0;
        }
        else {
            normalIncome += incomeRate.normal * temp[1] * temp[0];
            people.manualWorkers -= temp[1];
            people.normalPeople.delete(temp[0]);
        }
        temp = [...people.normalPeople][0];
    }

    // racuna se zarada objekata koji donose novac (teretane i restorani)
    var buildingsIncome = 0;
    var numOfRestaurants = 0;
    buildings.normal.forEach((element) => {
        switch(element.type) {
            case buildingTypes.Gym:
                buildingsIncome += gymIncome(element, buildings.normal);
                break;
            case buildingTypes.Parking: break;
            case buildingTypes.Restaurant:
                buildingsIncome += restaurantIncome(peopleArg, numOfRestaurants);
                numOfRestaurants++;
                break;
        }
    });

    return Math.floor(normalIncome + educatedIncome + buildingsIncome);
        // vraca se zbir zarada obicnih i edukovanih ljudi i objekata koji donose novac
        // 'floor' da bi brojevi bili lepsi
}

// #endregion

function getDynamicData(city, achievementsArg) {
    if(!achievementsArg) {
        achievementsArg = city.achievementList;
    }
    let achievements = {};
    achievementsArg.forEach((element) => {
        achievements[element.key] = { 
            completed: element.completed,
            rewardType: achievementModule.achievements[element.key].rewardType,
            rewardValue: achievementModule.achievements[element.key].rewardValue
        };
    });

    // #region BOOST EDUCATED

    // counting how many achievements with the 'educatedBoost' reward were completed
    let educatedBoost = Object.values(achievements).filter((achievement) => achievement.completed && achievement.rewardType === 'educatedBoost').length

    // #endregion

    let map = mapModule.initializeMap({ normal: city.buildings }, city.dimensions);
    let people = peopleModule.countPeople({ normal: city.buildings }, map, educatedBoost);
    let income = calculate(people, { normal: city.buildings });

    // #region BOOST INCOME:

    // multiplying the income by the factor of every reward received of this type
    Object.values(achievements).forEach(element => {
        if(element.completed === true && element.rewardType === achievementModule.rewardTypes.boost) {
            income *= element.rewardValue;
        }
    })

    // #endregion

    let educatedPeople = Array.from(people.educatedPeople.values()).reduce((prev, curr) => prev+curr, 0);
    let normalPeople = Array.from(people.normalPeople.values()).reduce((prev, curr) => prev+curr, 0);

    return {
        income, 
        people: { educatedPeople, normalPeople, manualWorkers: people.manualWorkers, officeWorkers: people.officeWorkers }, 
        map
    };
}

function calculateIncome(city, achievementsArg) {
    let dynamicData = getDynamicData(city, achievementsArg);
    return dynamicData.income;
}

// let res = getDynamicData(JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":2067026320,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":5770,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"highEducation","count":0,"completed":false},{"key":"skyCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false}],"income":358216,"score":2069533832}'));

// console.log({...res, map: undefined});

exports.getDynamicData = getDynamicData;
exports.calculateIncome = calculateIncome;