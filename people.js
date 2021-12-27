
function countPeople(buildings) {
    var normalPeople =  0;
    var educatedPeople = 0;
    var manualWorkers =  0;
    var officeWorkers =  0;
    buildings.forEach((element) => {
        normalPeople += element.type.normalPeople;
        educatedPeople += element.type.educatedPeople;
        manualWorkers += element.type.manualWorkers;
        officeWorkers += element.type.officeWorkers;
    });
    return {
        normalPeople: normalPeople,
        educatedPeople: educatedPeople,
        manualWorkers: manualWorkers,
        officeWorkers: officeWorkers
    };
}

exports.countPeople = countPeople;