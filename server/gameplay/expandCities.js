const incomeModule = require('./income');
const generateModule = require('../rand_map/generate');

/*

City {
    start: { x, y }, // start coordinate of the city
    end: { x, y }, // end coordinate of the city
    buildings: [ { start, end, level, orientation, type } ],
    specialBuildings: [ { start, end, orientation, type } ],
    specialBuildingCash: [ string ],
    money: Number,
    income: Number,
    incomesReceived: Number,
    ...
}

*/

/**
 * @dev function that expands a city
 * @param {City} city the city which is being expanded
 * @param {{start: { x, y }, end: { x, y }}} direction showing how much the city is expanded in each direction
 * @param {Number} price of each square the city is expanded with
 * @returns {[Boolean, City]} weather or not the action was successful, the data aobut the new city
 */
function expand(city, direction, price) {
    let newCity = JSON.parse(JSON.stringify(city));
    newCity.buildings = newCity.buildings.map(element => ({ 
        ...element,
        start: {
            x: element.start.x + direction.start.x,
            y: element.start.y + direction.start.y,
        },
        end: {
            x: element.end.x + direction.start.x,
            y: element.end.y + direction.start.y,
        }
    }));
    newCity.specialBuildings = newCity.specialBuildings.map(element => ({ 
        ...element,
        start: {
            x: element.start.x + direction.start.x,
            y: element.start.y + direction.start.y,
        },
        end: {
            x: element.end.x + direction.start.x,
            y: element.end.y + direction.start.y,
        }
    }));
    
    let newDimensions = {
        x: city.dimensions.x + direction.start.x + direction.end.x,
        y: city.dimensions.y + direction.start.y + direction.end.y,
    }

    let cost = price * (newDimensions.x * newDimensions.y - city.dimensions.x * city.dimensions.y);
    if(cost > city.money) {
        // there is not enough money to perform the merging of the two cities
        return [ false, city ];
    }
    
    newCity.money = city.money - cost;
    newCity.dimensions = JSON.parse(JSON.stringify(newDimensions));
    
    return [ true, newCity ];

}

function rotateBuilding(building, r, dimensions) {
    if(r === 0) return building;
    else return rotateBuilding({
        ...building,
        orientation: (building.orientation + 1) % 4,
        start: {
            x: building.start.y,
            y: dimensions.x - 1 - building.end.x
        },
        end: {
            x: building.end.y,
            y: dimensions.x - 1 - building.start.x
        }
    }, r-1, { x: dimensions.y, y: dimensions.x });
}

/**
 * @dev function that merges two cities into one
 * @param {City} city1 data about the first city
 * @param {City} city2 data about the second city
 * @param {{x: Number, y: Number}} start1 coordinates of the first city
 * @param {{x: Number, y: Number}} start1 coordinates of the second city
 * @param {Number} rotation1 of the first city {0, 1, 2, 3}
 * @param {Number} rotation2 of the second city {0, 1, 2, 3}
 * @param {Number} x component of the dimensions of the new city
 * @param {Number} y component of the dimensions of the new city
 * @returns {[Boolean, City]} weather or not the action was successful, the data aobut the new city
 */
function merge(city1, city2, start1, start2, rotation1, rotation2, x, y) {
    const COST = 200_000; // this amount of money will be deducted from the cities total
    const LAND_PRICE = 5_000; // the price per one grid square that is added
    const message = (m) => [ false, { message: `${m}` } ];

    let newCity1 = JSON.parse(JSON.stringify(city1));
    let newCity2 = JSON.parse(JSON.stringify(city2));

    // #region checking basic conditions

    if(city1.owner !== city2.owner) {
        console.log('failed because the owner of the cities are not the same');
        return message('failed because the owner of the cities are not the same');
    }

    if(city1.theme !== city2.theme) {
        console.log('failed because the theme of the cities are not the same');
        return message('failed because the theme of the cities are not the same');
    }

    // #endregion

    // #region checking is one of the cities is empty

    if(
        (city1.buildings.length === 0 && city1.specialBuildings.length === 0) ||
        (city2.buildings.length === 0 && city2.specialBuildings.length === 0)
    ) {
        return fail;
    }

    // #endregion

    // #region apply the rotations to the cities

    if(rotation1 % 2 === 1) {
        newCity1.dimensions.x = city1.dimensions.y;
        newCity1.dimensions.y = city1.dimensions.x;
    }
    newCity1.buildings = city1.buildings.map(element => rotateBuilding(element, rotation1, city1.dimensions));
    
    if(rotation1 % 2 === 1) {
        newCity2.dimensions.x = city2.dimensions.y;
        newCity2.dimensions.y = city2.dimensions.x
    }
    newCity2.buildings = city2.buildings.map(element => rotateBuilding(element, rotation2, city2.dimensions));

    // #endregion

    // #region apply the position of the cities (using the extend city function)

    let buildings, specialBuildings;
    
    [ , { buildings, specialBuildings } ] = expand(newCity1, { start: { ...start1 }, end: { x:0,y:0 } }, 0);
    newCity1.buildings = buildings;
    newCity1.specialBuildings = specialBuildings;

    [ , { buildings, specialBuildings } ] = expand(newCity2, { start: { ...start2 }, end: { x:0,y:0 } }, 0);
    buildings = buildings.map(element => ({
        ...element,
        id: element.id + newCity1.buildingId
    }));
    specialBuildings = specialBuildings.map(element => ({
        ...element,
        id: element.id + newCity1.specialBuildingId
    }));

    newCity2.buildings = buildings;
    newCity2.specialBuildings = specialBuildings;

    // #endregion

    // #region checking the dimensions of the map

    if(Math.max(x, y) > Math.max(newCity1.dimensions.x, newCity1.dimensions.y) + Math.max(newCity2.dimensions.x, newCity2.dimensions.y)) {
        console.log('The dimensions given are not valid');
        return message('The dimensions given are not valid');
    }

    // #endregion

    // #region checking if the buildings overlap

    let max = { x: 0, y: 0 };

    [ ...newCity1.buildings, ...newCity1.specialBuildings, ...newCity2.buildings, ...newCity2.specialBuildings ].forEach((element) => {
        if(element.end.x > max.x) {
            max.x = element.end.x;
        }
        if(element.end.y > max.y) {
            max.y = element.end.y
        }
    });

    if(max.x >= x || max.y >= y) {
        return message('failed because the buildings go out of bounds');
    }

    [ ...newCity1.buildings, ...newCity1.specialBuildings ].forEach((element1) => {
        [ ...newCity2.buildings, ...newCity2.specialBuildings ].forEach((element2) => {
            
        });
    });

    let arr1 = [ ...newCity1.buildings, ...newCity1.specialBuildings ];
    let arr2 = [ ...newCity2.buildings, ...newCity2.specialBuildings ];
    for(let i = 0; i < arr1.length; i++) {
        let element1 = arr1[i];
        for(let j = 0; j < arr2.length; j++) {
            let element2 = arr2[j];
            if(generateModule.doOverlap(element1, element2)) {
                console.log('failed because the buildings overlap');
                return message('failed because the buildings overlap');
            }
        }
    }

    // #endregion

    // #region adding all the data to the newCity object

    let newCity = {};

    newCity.buildings = [ ...newCity1.buildings, ...newCity2.buildings ];
    newCity.specialBuildings = [ ...newCity1.specialBuildings, ...newCity2.specialBuildings ];
    newCity.specialBuildingCash = [ ...newCity1.specialBuildingCash, ...newCity2.specialBuildingCash ];

    newCity.buildingId = newCity1.buildingId + newCity2.buildingId;
    newCity.specialBuildingId = newCity1.specialBuildingId + newCity2.specialBuildingId;
    newCity.incomesReceived = newCity1.incomesReceived;
    newCity.created = true;
    newCity.initialized = true;

    newCity.dimensions = { x: x, y: y };
    
    newCity.money = newCity1.money + newCity2.money - COST;
    newCity.owner = newCity1.owner;
    newCity.theme = newCity1.theme;
    newCity.normal = newCity1.normal + newCity2.normal;
    newCity.educated = newCity1.educated + newCity2.educated;
    newCity.normalWorkers = newCity1.normalWorkers + newCity2.normalWorkers;
    newCity.educatedWorkers = newCity1.educatedWorkers + newCity2.educatedWorkers;
        
    let achievementsObj = {};
    [ ...newCity1.achievementList, ...newCity2.achievementList ].forEach(element => {
        if(element.completed) {
            achievementsObj[element.key] = true;
        }
    });
    console.log(achievementsObj);
    newCity.achievementList = newCity1.achievementList;
    newCity.achievementList = newCity.achievementList.map(element => ({
        ...element,
        completed: achievementsObj[element.key] === true
    }));
    
    // console.log(newCity);

    let income = incomeModule.calculateIncome(newCity);
    newCity.income = income;
    // TODO napraviti u nekom posebnom fajlu da se racuna score na osnovu podataka o gradu
    newCity.score = 7 * income + newCity.money; 

    // #endregion
    
    return [ true, newCity ];

}

function test1() {
    let city = JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":2067026320,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":5770,"created":true,"initialized":true,"theme":0,"buildingId":13,"specialBuildingId":2,"dimensions":{"x":20,"y":20},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"educatedCity","count":0,"completed":false},{"key":"suburbia","count":0,"completed":false},{"key":"skyCity","count":0,"completed":false},{"key":"ecoFriendlyCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false},{"key":"productivePeople","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false}],"income":340079,"score":2069406873}');
    let direction = {start: {x: 2, y: 3 }, end: {x: 1, y: 2}};
    let [ success, newCity ] = expand(city, direction, 1000);
    console.log(city.money);
    console.log(newCity.money);
    console.log(city.money - newCity.money);
}

function test2() {
    let city1 = JSON.parse('{"buildings":[{"start":{"x":4,"y":4},"end":{"x":4,"y":4},"type":"house","level":0,"orientation":1,"id":0},{"start":{"x":10,"y":19},"end":{"x":10,"y":19},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":12,"y":14},"end":{"x":12,"y":14},"type":"house","level":0,"orientation":1,"id":2},{"start":{"x":7,"y":3},"end":{"x":7,"y":3},"type":"house","level":0,"orientation":2,"id":3},{"start":{"x":4,"y":17},"end":{"x":4,"y":17},"type":"house","level":0,"orientation":1,"id":4},{"start":{"x":11,"y":4},"end":{"x":12,"y":5},"type":"building","level":0,"orientation":1,"id":5},{"start":{"x":0,"y":6},"end":{"x":3,"y":7},"type":"factory","level":0,"orientation":2,"id":6},' + 
    '{"start":{"x":11,"y":7},"end":{"x":12,"y":8},"type":"office","level":0,"orientation":2,"id":7},{"start":{"x":9,"y":12},"end":{"x":9,"y":12},"type":"store","level":0,"orientation":1,"id":8},{"start":{"x":14,"y":5},"end":{"x":14,"y":5},"type":"store","level":0,"orientation":2,"id":9},{"start":{"x":5,"y":11},"end":{"x":7,"y":14},"type":"park","level":0,"orientation":1,"id":10},{"start":{"x":17,"y":17},"end":{"x":19,"y":19},"type":"park","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":14,"y":12},"end":{"x":14,"y":12},"type":"statue","orientation":1,"id":0},{"start":{"x":10,"y":6},"end":{"x":11,"y":6},"type":"fountain","orientation":2,"id":1},{"start":{"x":5,"y":15},"end":{"x":5,"y":15},"type":"statue","orientation":1,"id":2},{"start":{"x":6,"y":15},"end":{"x":6,"y":15},"type":"statue","orientation":1,"id":3},{"start":{"x":7,"y":15},"end":{"x":7,"y":15},"type":"statue","orientation":1,"id":4},{"start":{"x":8,"y":15},"end":{"x":8,"y":15},"type":"statue","orientation":1,"id":5},{"start":{"x":9,"y":15},"end":{"x":9,"y":15},"type":"statue","orientation":2,"id":6}],"specialBuildingCash":[],"money":429940,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":12,"specialBuildingId":8,"dimensions":{"x":20,"y":20},"normal":18,"educated":17,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"educatedCity","count":0,"completed":true},{"key":"check4","count":0,"completed":true},{"key":"skyCity","count":0,"completed":true},{"key":"suburbia","count":0,"completed":false},{"key":"ecoFriendlyCity","count":0,"completed":false},{"key":"productivePeople","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false}],"income":461125,"score":3657815}');
    let city2 = JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":2067026320,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":5770,"created":true,"initialized":true,"theme":0,"buildingId":13,"specialBuildingId":2,"dimensions":{"x":20,"y":20},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"educatedCity","count":0,"completed":false},{"key":"suburbia","count":0,"completed":false},{"key":"skyCity","count":0,"completed":false},{"key":"ecoFriendlyCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":true},{"key":"productivePeople","count":0,"completed":true},{"key":"check4","count":0,"completed":true},{"key":"greenCity","count":0,"completed":false}],"income":340079,"score":2069406873}');

    let res = merge(city1, city2, {x: 0, y: 6 }, { x: 18, y: 19 }, 1, 2, 40, 40);
    console.log(res);

    let [ status, city ] = res;
    // if(status === true) {
    //     console.log(city1.achievementList, city2.achievementList, city.achievementList);
    // }
}

test2();

exports.merge = merge;
