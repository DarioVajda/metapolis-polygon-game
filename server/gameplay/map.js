
/**
 * @dev num of squares on a map
 */
const mapDimensions = 20;

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
function buildingEffectMap({type, level, start, end}) {
    // checks for the coordiantes values

    let map = Array(mapDimensions);
    for(let i = 0; i < mapDimensions; i++) {
        map[i] = Array(mapDimensions).fill(1);
    }
    
    switch(type) {
        case buildingTypes.Factory:
            for(let i = 0; i < mapDimensions; i++) {
                for(let j = 0; j < mapDimensions; j++) {
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
            for(let i = Math.max(0, start.y - buildingStats.get(type)[level].range); i <= Math.min(mapDimensions - 1, end.y + buildingStats.get(type)[level].range); i++) {
                for(let j = Math.max(0, start.x - buildingStats.get(type)[level].range); j <= Math.min(mapDimensions - 1, end.x + buildingStats.get(type)[level].range); j++) {
                    map[i][j] = buildingStats.get(type)[level].boost;
                }
            }
            break;
        case buildingTypes.Park:
            let range = Math.floor(((end.x - start.x + 1) + (end.y - start.y + 1)) / 2);
            for(let i = Math.max(0, start.y - range); i <= Math.min(mapDimensions - 1, end.y + range); i++) {
                for(let j = Math.max(0, start.x - range); j <= Math.min(mapDimensions - 1, end.x + range); j++) {
                    map[i][j] = buildingStats.get(type)[level].boost;
                }
            }
            break;
        case buildingTypes.Store:
            for(let i = 0; i < mapDimensions; i++) {
                for(let j = 0; j < mapDimensions; j++) {
                    if(!(
                        i >= start.y - buildingStats.get(type)[level].range &&
                        i <= end.y + buildingStats.get(type)[level].range   &&
                        j >= start.x - buildingStats.get(type)[level].range &&
                        j <= end.x + buildingStats.get(type)[level].range
                    )) {
                        map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * mapDimensions-2);
                    }
                }
            }
            break;
        case buildingTypes.SuperMarket:
            for(let i = 0; i < mapDimensions; i++) {
                for(let j = 0; j < mapDimensions; j++) {
                    if(!(
                        i >= start.y - buildingStats.get(type)[level].range &&
                        i <= end.y + buildingStats.get(type)[level].range   &&
                        j >= start.x - buildingStats.get(type)[level].range &&
                        j <= end.x + buildingStats.get(type)[level].range
                    )) {
                        map[i][j] = 1 - buildingStats.get(type)[0].maxDecrease * (storeDistance(start, end, j, i)) / (2 * mapDimensions-2);
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

function mergeEffectMapPair(map1, map2, mergeFunction) {
    for(let i = 0; i < mapDimensions; i++) {
        for(let j = 0; j < mapDimensions; j++) {
            map1[i][j] = mergeFunction(map1[i][j], map2[i][j])
        }
    }
    return map1;
}

function mergeEffectMaps(normal, type, func, initial) {

    let startingMap = Array(mapDimensions);
    for(let i = 0; i < mapDimensions; i++) {
        startingMap[i] = Array(mapDimensions).fill(normal.filter(element=>element.type===type).length===0?1:initial);
    }
    return normal
        .filter(element => element.type === type || (type === buildingTypes.Store && element.type === buildingTypes.SuperMarket))
        .map(element => buildingEffectMap(element))
        .reduce(
            (prev, curr) => { 
                return mergeEffectMapPair(prev, curr, func)
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
function initializeMap({ normal, special }) {
    let startingMap = Array(mapDimensions);
    for(let i = 0; i < mapDimensions; i++) {
        startingMap[i] = Array(mapDimensions).fill(1);
    }

    // treba popraviti da se zajedno gledaju prodavnice i supermarketi
    let map = Object.values(buildingTypes)
        .filter(element => element != buildingTypes.SuperMarket) // supermarkets are considered with the stores at once
        .map(element => {
            let tempMap = mergeEffectMaps(
                normal, 
                element, 
                element === buildingTypes.Factory ? (a, b) => a * b : (a, b) => Math.max(a, b),
                element === buildingTypes.Factory ? 1 : 0
            );
            // console.log(element);
            // console.table(tempMap.map(row => row.map(element => Math.round(element*100)/100))); 
            return tempMap;
        })
        .reduce(
            (prev, curr) => mergeEffectMapPair(prev, curr, (a, b) => a * b),
            startingMap
        )

    // console.table(map.map(row => row.map(element => Math.round(element*100)/100)));
    return map;
}

// #region Testing
// console.table(
//     buildingEffectMap({ type: 'factory', level: 0, start: { x: 12, y: 1 }, end: { x: 14, y: 2} })
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// console.table(
//     buildingEffectMap({ type: 'park', level: 0, start: { x: 12, y: 1 }, end: { x: 14, y: 2} })
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// console.table(
//     buildingEffectMap({ type: 'store', level: 0, start: { x: 12, y: 1 }, end: { x: 12, y: 1} })
//         .map(arr => arr.map(element => 
//             Math.round(element*100)/100
//         ))
// );
// #endregion

exports.mapDimensions = mapDimensions;
exports.buildingEffectMap = buildingEffectMap;
exports.initializeMap = initializeMap;