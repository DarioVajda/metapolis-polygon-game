
/**
 * @dev num of squares on a map
 */
const MAP_DIMENSIONS = { x: 20, y: 20 };

const buildingsModule = require('./building_stats');
const buildingTypes = buildingsModule.buildingTypes;
const buildingStats = buildingsModule.buildingStats;

// #region utils

function pythagoreanTheorem(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function storeDistance(start, end, x, y) {
    let distance = { x: 0, y: 0 };

    if(x < start.x) distance.x = start.x - x;
    else if(x > end.x) distance.x = x - end.x;

    if(y < start.y) distance.y = start.y - y;
    else if(y > end.y) distance.y = y - end.y;

    return distance.x + distance.y;
}

// #endregion

/**
 * @param   {String}                    type    of the building
 * @param   {Number}                    level   of the building
 * @param   {{x: Number, y: Number}}    start   coordinate of the building
 * @param   {{x: Number, y: Number}}    end     coordinate of the building
 * @return  {Number[][]}                        matrix with the productivities on each square in the city      
 */
function buildingEffectMap({type, level, start, end}, mapDimensions) {
    // checks for the coordiantes values

    if(mapDimensions === undefined) {
        mapDimensions = MAP_DIMENSIONS;
    }

    let map = Array(mapDimensions.y);
    for(let i = 0; i < mapDimensions.y; i++) {
        map[i] = Array(mapDimensions.x).fill(1);
    }
    
    // console.log(mapDimensions);
    // console.table(map);
    switch(type) {
        case buildingTypes.Factory:
            for(let i = 0; i < mapDimensions.x; i++) {
                for(let j = 0; j < mapDimensions.y; j++) {
                    let distanceFromFactory = pythagoreanTheorem(
                        (start.x + end.x) / 2 - i,
                        (start.y + end.y) / 2 - j,
                    );
                    if(distanceFromFactory < buildingStats.get(type)[level].radius) {
                        map[j][i] *= 1 - buildingStats.get(type)[level].maxDecrease * (1 - distanceFromFactory / buildingStats.get(type)[level].radius);
                    }
                }
            }
            break;
        case buildingTypes.House:
            map[start.y][start.x] *= buildingStats.get(type)[level].boost;
            break;
        case buildingTypes.Gym:
            for(let i = Math.max(0, start.y - buildingStats.get(type)[level].range); i <= Math.min(mapDimensions.y - 1, end.y + buildingStats.get(type)[level].range); i++) {
                for(let j = Math.max(0, start.x - buildingStats.get(type)[level].range); j <= Math.min(mapDimensions.x - 1, end.x + buildingStats.get(type)[level].range); j++) {
                    map[i][j] = buildingStats.get(type)[level].boost;
                }
            }
            break;
        case buildingTypes.Park:
            let range = Math.floor(((end.x - start.x + 1) + (end.y - start.y + 1)) / 2);
            for(let i = Math.max(0, start.y - range); i <= Math.min(mapDimensions.y - 1, end.y + range); i++) {
                for(let j = Math.max(0, start.x - range); j <= Math.min(mapDimensions.x - 1, end.x + range); j++) {
                    map[i][j] = buildingStats.get(type)[level].boost;
                }
            }
            break;
        case buildingTypes.Store:
            for(let i = 0; i < mapDimensions.y; i++) {
                for(let j = 0; j < mapDimensions.x; j++) {
                    if(!(
                        i >= start.y - buildingStats.get(type)[level].range &&
                        i <= end.y + buildingStats.get(type)[level].range   &&
                        j >= start.x - buildingStats.get(type)[level].range &&
                        j <= end.x + buildingStats.get(type)[level].range
                    )) {
                        // map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * mapDimensions-2);
                        map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * 20-2);
                    }
                }
            }
            break;
        case buildingTypes.SuperMarket:
            for(let i = 0; i < mapDimensions.y; i++) {
                for(let j = 0; j < mapDimensions.x; j++) {
                    if(!(
                        i >= start.y - buildingStats.get(type)[level].range &&
                        i <= end.y + buildingStats.get(type)[level].range   &&
                        j >= start.x - buildingStats.get(type)[level].range &&
                        j <= end.x + buildingStats.get(type)[level].range
                    )) {
                        // map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * mapDimensions-2);
                        map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * 20-2);
                    }
                }
            }
            break;
    }

    // map = map.map(row => row.map(element => Math.round(element*100)/100))
    // console.table(map)
    return map;
}

// #region merging maps

function mergeEffectMapPair(map1, map2, mergeFunction, mapDimensions) {
    for(let i = 0; i < mapDimensions.y; i++) {
        for(let j = 0; j < mapDimensions.x; j++) {
            map1[i][j] = mergeFunction(map1[i][j], map2[i][j])
        }
    }
    return map1;
}

function mergeEffectMaps(normal, type, func, initial, mapDimensions) {

    let startingMap = Array(mapDimensions.y);
    for(let i = 0; i < mapDimensions.y; i++) {
        startingMap[i] = Array(mapDimensions.x).fill(normal.filter(element=>element.type===type).length===0?1:initial);
    }
    return normal
        .filter(element => element.type === type || (type === buildingTypes.Store && element.type === buildingTypes.SuperMarket))
        .map(element => buildingEffectMap(element, mapDimensions))
        .reduce(
            (prev, curr) => { 
                return mergeEffectMapPair(prev, curr, func, mapDimensions)
            },
            startingMap
        )
}

// #endregion

/**
 * @dev      Function that is used to get the productivity on each square in the city for given buildings
 * @param    {{normal: Building[], special: SpecialBuilding[]}}     buildings   object containing the lists of normal and special buildings
 * @returns  {Number[][]}                                                       matrix with the productivities on each square in the city   
 */
function initializeMap({ normal, special }, mapDimensions) {
    if(mapDimensions === undefined) {
        mapDimensions = MAP_DIMENSIONS;
    }
    // console.log(mapDimensions)

    let startingMap = Array(mapDimensions.y);
    for(let i = 0; i < mapDimensions.y; i++) {
        startingMap[i] = Array(mapDimensions.x).fill(1);
    }

    // treba popraviti da se zajedno gledaju prodavnice i supermarketi
    let map = Object.values(buildingTypes)
        .filter(element => element != buildingTypes.SuperMarket) // supermarkets are considered with the stores at once
        .map(element => {
            let tempMap = mergeEffectMaps(
                normal, 
                element, 
                element === buildingTypes.Factory ? (a, b) => a * b : (a, b) => Math.max(a, b),
                element === buildingTypes.Factory ? 1 : 0,
                mapDimensions
            );
            // console.log(element);
            // console.table(tempMap.map(row => row.map(element => Math.round(element*100)/100))); 
            return tempMap;
        })
        .reduce(
            (prev, curr) => mergeEffectMapPair(prev, curr, (a, b) => a * b, mapDimensions),
            startingMap
        )

    // console.table(map.map(row => row.map(element => Math.round(element*100)/100)));
    return map;
}

// #region Testing
// console.table(
//     buildingEffectMap({ type: 'factory', level: 0, start: { x: 12, y: 1 }, end: { x: 14, y: 2} }, MAP_DIMENSIONS)
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// console.table(
//     buildingEffectMap({ type: 'park', level: 0, start: { x: 12, y: 1 }, end: { x: 14, y: 2} }, MAP_DIMENSIONS)
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// console.table(
//     buildingEffectMap({ type: 'factory', level: 0, start: { x: 0, y: 0 }, end: { x: 2, y: 4} }, {x: 4, y: 40})
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// console.table(
//     initializeMap(
//         {normal: JSON.parse('[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}]'), special: JSON.parse('[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}]') },
//         { x: 21, y: 28 }
//     )
//         .map(arr => arr.map(element =>
//             Math.round(element*100)/100
//         ))
// )
// #endregion

exports.mapDimensions = 20;
exports.buildingEffectMap = buildingEffectMap;
exports.initializeMap = initializeMap;