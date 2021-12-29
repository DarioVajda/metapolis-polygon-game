
const incomeRate = {
    educated: 10000,
    normal: 5000
}; // mothly pays

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
}

function calculateIncome(peopleArg) {
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

    return Math.floor(normalIncome + educatedIncome);
}

exports.calculateIncome = calculateIncome;