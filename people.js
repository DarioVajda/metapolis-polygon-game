
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
}

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
}

function countPeople(buildings, map) {
    // mozda bih u mape mogao da dodam i vrednost koja predstavlja ukupan broj obicnih i pametnih ljudi
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
    // nece da mi se sortira kako treba, bude 1.32, 1.2, 1, 1.1 ...
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