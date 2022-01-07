const { buildingStats, buildingTypes } = require("./building_stats");

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
} // vraca najvecu produktivnost od svih polja na kojima se nalazi zgrada

function sortMap(map) {
    return new Map([...map.entries()].sort((a,b) => b[0] - a[0]));
} // pomocna funkcija za sortiranje mape po vrednostima kljuceva

function countPeople(buildings, map) {
    // funkcija koja pravi 'people' objekat koji sadrzi podatke o ljudima i radnim mestima
    var normalPeople =  new Map(); // mapa gde je kljuc produktivnost, a vrednost broj ljudi sa tom produktivnoscu
    var educatedPeople = new Map(); // mapa gde je kljuc produktivnost, a vrednost broj ljudi sa tom produktivnoscu
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
            if(tempNormalPeople > 0) normalPeople.set(productivity, tempNormalPeople);
        }

        if(educatedPeople.has(productivity)) {
            temp = educatedPeople.get(productivity);
            educatedPeople.delete(productivity);
            educatedPeople.set(productivity, temp + tempEducatedPeople);
        }
        else {
            if(tempEducatedPeople > 0) educatedPeople.set(productivity, tempEducatedPeople);
        }

        manualWorkers += buildingStats.get(element.type)[element.level].manualWorkers;
        officeWorkers += buildingStats.get(element.type)[element.level].officeWorkers;
    }); // racuna se broj ljudi i radnih mesta
    normalPeople = sortMap(normalPeople); // sortiraju se mape
    educatedPeople = sortMap(educatedPeople); // sortiraju se mape
    return {
        normalPeople: normalPeople,
        educatedPeople: educatedPeople,
        manualWorkers: manualWorkers,
        officeWorkers: officeWorkers
    }; // vraca se objekat sa ovim poljima i vrednostima
}

exports.countPeople = countPeople;