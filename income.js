const buildingsModule = require('./building');
const buildingTypes = buildingsModule.buildingTypes;

const incomeRate = {
    educated: 10000,
    normal: 5000,
    gymIncomePerPerson: 150,
    restaurantIncomePerPerson: 200
}; // mothly pays

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
}

function inRange(gym, building) {
    if(Math.min(Math.abs(gym.start.x - building.end.x), Math.abs(gym.end.x - building.start.x)) <= gym.type.range 
    && Math.min(Math.abs(gym.start.y - building.end.y), Math.abs(gym.end.y - building.start.y)) <= gym.type.range) {
        return true;
    }

    return false;
}

function gymIncome(gym, buildings) {
    var r = 0;
    buildings.forEach((element) => {
        if(inRange(gym, element)) {
            r += (element.type.normalPeople + element.type.educatedPeople) * incomeRate.gymIncomePerPerson;
            if(element.type.normalPeople + element.type.educatedPeople > 0) {
                //console.log('people: ' + (element.type.normalPeople + element.type.educatedPeople));
                // console.log(element);
            }
        }
    });
    return r;
}

function restaurantIncome(people, n) {
    var numOfPeople = 0;
    [...people.normalPeople.values()].forEach((element) => {
        numOfPeople += element;
    });
    [...people.educatedPeople.values()].forEach((element) => {
        numOfPeople += element;
    });

    return numOfPeople * incomeRate.restaurantIncomePerPerson;
}

function calculateIncome(peopleArg, buildings) {
    var educatedIncome = 0;
    var normalIncome = 0;
    var people = {
        normalPeople: new Map([...peopleArg.normalPeople]),
        educatedPeople: new Map([...peopleArg.educatedPeople]),
        manualWorkers: peopleArg.manualWorkers,
        officeWorkers: peopleArg.officeWorkers
    }; // copying contents of the main people object in a temporary one
    var temp = [...people.educatedPeople][0];
    
    // calculating income for officeWorkers
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
    // calculating income for the manualWorkers
    // if there are left office workers we can use them here too
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
    } // adding the educated people to the normal people list
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

    var buildingsIncome = 0;
    var numOfRestaurants = 0;
    buildings.forEach((element) => {
        switch(element.type) {
            case buildingTypes.Gym[0]:
            case buildingTypes.Gym[1]:
                buildingsIncome += gymIncome(element, buildings);
                break;
            case buildingTypes.Parking[0]: break;
            case buildingTypes.Restaurant[0]:
                buildingsIncome += restaurantIncome(peopleArg, numOfRestaurants);
                numOfRestaurants++;
                break;
        } // trebam da dodam funkcije za racunanje zarade ovih objekata!!!!!!!!!!!
    });

    return Math.floor(normalIncome + educatedIncome + buildingsIncome);
} // 2648382 - without restaurants

exports.calculateIncome = calculateIncome;