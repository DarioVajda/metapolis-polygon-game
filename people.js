
function getproductivity(building, map) {
    var productivity = 0;
    for(let i = building.start.x; i <= building.end.x; i++) {
        for(let j = building.start.y; j <= building.end.y; j++) {
            if(map[j][i].productivity > productivity) {
                productivity = map[j][i].productivity;
            }
        }
    }
    return productivity;
} // returning the highest productivity among the lands the building is on

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
}

function countPeople(buildings, map) {
    // creating the "people" object with the info about the people and the workplaces
    var normalPeople =  new Map();
    var educatedPeople = new Map();
    var manualWorkers =  0;
    var officeWorkers =  0;

    var productivity;
    var temp;
    buildings.forEach((element) => {
        productivity = getproductivity(element, map);
        if(normalPeople.has(productivity)) {
            temp = normalPeople.get(productivity);
            normalPeople.delete(productivity);
            normalPeople.set(productivity, temp + element.type.normalPeople);
        }
        else {
            normalPeople.set(productivity, element.type.normalPeople);
        }

        if(educatedPeople.has(productivity)) {
            temp = educatedPeople.get(productivity);
            educatedPeople.delete(productivity);
            educatedPeople.set(productivity, temp + element.type.educatedPeople);
        }
        else {
            educatedPeople.set(productivity, element.type.educatedPeople);
        }

        manualWorkers += element.type.manualWorkers;
        officeWorkers += element.type.officeWorkers;
    });
    normalPeople = sortMap(normalPeople);
    educatedPeople = sortMap(educatedPeople);
    return {
        normalPeople: normalPeople,
        educatedPeople: educatedPeople,
        manualWorkers: manualWorkers,
        officeWorkers: officeWorkers
    };
}

exports.countPeople = countPeople;