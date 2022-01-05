const { buildingStats, buildingTypes } = require("./building");

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
        let tempNormalPeople = buildingStats.get(element.type)[element.level].normalPeople;
        let tempEducatedPeople = buildingStats.get(element.type)[element.level].educatedPeople;
        if(element.type === buildingTypes.Building) {
            tempNormalPeople *= (element.end.x - element.start.x + 1) * (element.end.y - element.start.y + 1)
            tempEducatedPeople *= (element.end.x - element.start.x + 1) * (element.end.y - element.start.y + 1)
        }
        if(normalPeople.has(productivity)) {
            temp = normalPeople.get(productivity);
            normalPeople.delete(productivity);
            normalPeople.set(productivity, temp + tempNormalPeople);
        }
        else {
            normalPeople.set(productivity, tempNormalPeople);
        }

        if(educatedPeople.has(productivity)) {
            temp = educatedPeople.get(productivity);
            educatedPeople.delete(productivity);
            educatedPeople.set(productivity, temp + tempEducatedPeople);
        }
        else {
            educatedPeople.set(productivity, tempEducatedPeople);
        }

        manualWorkers += buildingStats.get(element.type)[element.level].manualWorkers;
        officeWorkers += buildingStats.get(element.type)[element.level].officeWorkers;
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