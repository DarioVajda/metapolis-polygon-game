const buildingsModule = require('../gameplay/building');

function isBuildingFormat(obj) {
    if(
        obj.start === undefined ||
        obj.end === undefined ||
        typeof obj.start.x !== 'number' ||
        typeof obj.start.y !== 'number' ||
        typeof obj.end.x !== 'number' ||
        typeof obj.end.y !== 'number' ||
        typeof obj.type !== 'string'// ||
        // Object.values(obj).length !== 3 ||
        // Object.values(obj.start) !== 2 ||
        // Object.values(obj.end) !== 2

    ) {
        console.log('false');
        return false;
    }

    let typeValid = false;
    Object.values(buildingsModule.buildingTypes).forEach(type => {
        if(type === obj.type) {
            typeValid = true;
        }
    });

    let coordinatesValid = true;
    if((0 <= obj.start.x && obj.start.x <= obj.end.x && obj.end.x < 20) === false) {
        coordinatesValid = false;
    }
    if((0 <= obj.start.y && obj.start.y <= obj.end.y && obj.end.y < 20) === false) {
        coordinatesValid = false;
    }

    return true;
}

function doesOverlap(building, map) {
    for(let i = building.start.x; i <= building.end.x; i++) {
        for(let j = building.start.y; j <= building.end.y; j++) {
            if(map[j][i] !== undefined && map[j][i].occupiedBy !== null) {
                return true;
            }
        }
    }
    return false;
}

exports.isBuildingFormat = isBuildingFormat;
exports.doesOverlap = doesOverlap;