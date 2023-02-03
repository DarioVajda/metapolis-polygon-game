const incomeModule = require('../gameplay/income');
const peopleModule = require('../gameplay/people');
const mapModule = require('../gameplay/map');

// #region Utils:

// Formatted as MM/DD/YYYY hh:mm:ss
const dateToUnix = (dateStr) => {

    const [dateComponents, timeComponents] = dateStr.split(' ');
    const [month, day, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');

    const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);

    const unixTimestamp = ~~(date.getTime() / 1000);

    return unixTimestamp;
}

// #endregion

// TODO implemetirati preview funkciju za extraEducated nagradu
const rewardTypes = {
    // ingame rewards:
    money: {
        key: 'money',
        preview: (city, value) => {
            city.money = city.money + value;
            return city;
        }
    },
    boost: {
        key: 'boost',
        preview: (city, value) => {
            city.income = city.income * value;
            return city;
        }
    },
    extraEducated: {
        // every building has an extra educated person instead of an uneducated
        key: 'extraEducated',
        preview: (city, value) => {
            // calculate the new income with the extra educated people
            let dynamicData = incomeModule.getDynamicData(city);
            return { ...city, ...dynamicData };
        }
    },
    specialBuilding: {
        key: 'specialBulding',
        preview: (city, value) => {
            // the 'value' argument should be a string indicating which special building was awarded to the player
            // add the special building to the special building cash list in the city
            city.specialBuildingCash = [ ...city.specialBuildingCash, value ]
            return city;
        }
    },
    populationBoost: {
        key: 'populationBoost',
        preview: (city, value) => {
            // calculate the new number of citizens and the new income accordingly
            return city;
        }
    },

    // other rewards:
    weth: {
        key: 'weth',
        preview: (city, value) => {
            // nothing to do here
            return city;
        }
    },
    matic: {
        key: 'matic',
        preview: (city, value) => {
            // nothing to do here
            return city;
        }
    }
}

// #region Check functions

const greenCity = (city) => {
    const MIN_SURFACE = 50;

    let buildings = city.buildings;

    let parks = buildings.filter(element => element.type === 'park');
    
    let surface = 0;
    parks.forEach(element => {
        surface += (element.end.x - element.start.x + 1) * (element.end.y - element.start.y + 1);
    });

    let completed = surface >= MIN_SURFACE;
    let message = completed ? 'Achievement completed.' : `Cover ${MIN_SURFACE - surface} more squares with parks.`

    return {
        completed: completed,
        value: completed ? 1 : surface / MIN_SURFACE,
        main: completed ? 'Claim reward' : `${surface}/${MIN_SURFACE}`,
        message: message
    };
}

const educatedCity = (city) => {
    const MIN_PEOPLE = 500;
    const MIN_EDUCATED_PERCENTAGE = 0.6;
    
    let people = city.educated + city.normal;
    let educated = city.educated;

    let completed = (people >= MIN_PEOPLE) && (educated / people >= MIN_EDUCATED_PERCENTAGE)
    let message;
    if(completed) {
        message = 'Achievement completed.'
    }
    else if(people < MIN_PEOPLE) {
        message = `${Math.floor(educated/people*1000)/10}% of people are educated. Population size is ${people}, but it should be at least ${MIN_PEOPLE}.`;
    }
    else {
        message = `${Math.floor(educated/people*1000)/10}% of people are educated.`
    }
    // return (people >= MIN_PEOPLE) && (educated / people >= MIN_EDUCATED_PERCENTAGE / 100);

    let value = people === 0 ? 0 : Math.min((educated / people) / (MIN_EDUCATED_PERCENTAGE), 1) * Math.min(people / MIN_PEOPLE, 1);

    return {
        completed: completed,
        value: value,
        main:  completed ? 'Claim reward' : `${Math.floor(value * 1000)/10}%`,
        message: message
    };
}

const skyCity = (city) => {
    const MIN_SKYSCRAPERS = 20;
    const MIN_SKYSCRAPER_LEVEL = 0;

    let buildings = city.buildings;
    let numOfSkyscrapers = 0;

    buildings.forEach(element => {
        if(element.type === 'building' && element.level === MIN_SKYSCRAPER_LEVEL) {
            numOfSkyscrapers += 1;
        }
    });

    let completed = numOfSkyscrapers >= MIN_SKYSCRAPERS;
    let message = completed ? 'Achievement completed.' : `Build ${MIN_SKYSCRAPERS - numOfSkyscrapers} more skyscrapers.`;

    let r = {
        completed: completed,
        value: completed ? 1 : numOfSkyscrapers / MIN_SKYSCRAPERS,
        main:  completed ? 'Claim reward' : `${numOfSkyscrapers}/${MIN_SKYSCRAPERS}`,
        message: message
    };

    return r;
};

const highEducation = (city) => {
    const MIN_SCHOOLS = 3;

    let buildings = city.specialBuildings;
    let numOfSchools = 0;

    buildings.forEach(element => {
        if(element.type === 'school') {
            numOfSchools += 1;
        }
    });

    let completed = numOfSchools >= MIN_SCHOOLS;
    let message = completed ? 'Achievement completed.' : `Build ${MIN_SCHOOLS - numOfSchools} more schools.`;

    let r = {
        completed: completed,
        value: completed ? 1 : numOfSchools / MIN_SCHOOLS,
        main:  completed ? 'Claim reward' : `${numOfSchools}/${MIN_SCHOOLS}`,
        message: message
    };

    return r;

}

const productivePeople = (city) => {
    const MIN_PRODUCTIVITY = 1.25;

    let map = mapModule.initializeMap({ normal: city.buildings });
    let people = peopleModule.countPeople({ normal: city.buildings }, map, 0);

    let productivitySum = 0;
    [...people.normalPeople].forEach(([key, value]) => {
        productivitySum += key * value;
    });
    [...people.educatedPeople].forEach(([key, value]) => {
        productivitySum += key * value;
    });

    let educatedPeople = Array.from(people.educatedPeople.values()).reduce((prev, curr) => prev+curr, 0);
    let normalPeople = Array.from(people.normalPeople.values()).reduce((prev, curr) => prev+curr, 0);

    let value = productivitySum / (educatedPeople + normalPeople);
    let completed = value > MIN_PRODUCTIVITY;
    let message = `The average productivity of your citizens is ${~~(value*100)}%, to complete the achievement it should be at least ${~~(MIN_PRODUCTIVITY*100)}%`;

    let r = {
        completed: completed,
        value: completed ? 1 : value / MIN_PRODUCTIVITY,
        main:  completed ? 'Claim reward' : `${~~(value*100)}% / ${~~(MIN_PRODUCTIVITY*100)}%`,
        message: message
    };

    return r;

}

const ecoFriendlyCity = (city) => {

    const MIN = 1.10;

    let map = mapModule.initializeMap({
        normal: city.buildings.filter(element => ['factory', 'park'].includes(element.type))
    })

    let sum = 0;
    let num = 0;
    map.forEach(row => {
        row.forEach(tile => {
            sum += tile;
            num++;
        });
    });

    let value = sum / num;
    let completed = value >= MIN;
    let message = `The polution is calculated based on the amount of vegetation and factories in the city.`;

    let r = {
        completed: completed,
        value: completed ? 1 : value / MIN,
        main:  completed ? 'Claim reward' : `${~~(value*100)}% / ${~~(MIN*100)}%`,
        message: message
    };

    return r;
}

const suburbia = (city) => {

    const MIN_HOUSES = 50;
    const MAX_BUILDINGS = 5;

    let b = 0;
    let h = 0;
    city.buildings.forEach(element => {
        if(element.type === 'building') {
            b++;
        }
        else if(element.type === 'house') {
            h++;
        }
    })

    let value = h / MIN_HOUSES * Math.min(1, MAX_BUILDINGS / b);
    let completed = value >= 1;
    let message = `The city has ${h} houses and ${b} buildings. To claim the reward it must have more than ${MIN_HOUSES} houses and less than ${MAX_BUILDINGS} buildings.`

    let r = {
        completed: completed,
        value: completed ? 1 : value,
        main:  completed ? 'Claim reward' : `${~~(value*100)}%`,
        message: message
    };

    return r;
}

const check4 = (city) => ({
    completed: true,
    value: 1,
    main: true ? 'Claim reward' : '100/100',
    message: 'message...'
});

// #endregion

const achievements = {
    greenCity: {
        checkFunction: greenCity,
        title: 'Green City',
        explanation: 'Cover at least 50 sqares with parks.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 1.05,
        // rewardValueJsx: <>+5%</>,
        rewardType: rewardTypes.boost.key,
        percentage: 0.05
    },
    educatedCity: {
        checkFunction: educatedCity,
        title: 'Educated City',
        explanation: 'Have a 60% educated city with a population size of at least 500',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 1e6,
        rewardType: rewardTypes.money.key,
        percentage: 0.05
    },
    skyCity: {
        checkFunction: skyCity,
        title: 'Break the sky',
        explanation: 'Build at least 20 skyscrapers (level 2 buildings).',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 500000,
        rewardType: rewardTypes.money.key,
        percentage: 0.025
    },
    highEducation: {
        checkFunction: highEducation,
        title: 'High education',
        explanation: 'Have at least 3 schools in your city.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: null,
        rewardType: rewardTypes.extraEducated.key,
        percentage: 0.03
    },
    productivePeople: {
        checkFunction: productivePeople,
        title: 'Productive People',
        explanation: 'The average productivity of people in the city must be at least 125%',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: null,
        rewardType: rewardTypes.populationBoost.key,
        percentage: 0.03
    },
    ecoFriendlyCity: {
        checkFunction: ecoFriendlyCity,
        title: 'Eco Friendly City',
        explanation: 'The average polution in the city must be less than 10%.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 'decorationTree',
        rewardType: rewardTypes.specialBuilding.key,
        percentage: 0.03
    },
    suburbia: {
        checkFunction: suburbia,
        title: 'Eco Friendly City',
        explanation: 'The average polution in the city must be less than 10%.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 1_000_000,
        rewardType: rewardTypes.money.key,
        percentage: 0.03
    },
    check4: {
        checkFunction: check4,
        title: 'check4',
        explanation: 'This is the check4.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 100,
        rewardType: rewardTypes.matic.key,
        percentage: 0.005
    },
}

const checkIfActive = ({ startDate, endDate }) => {
    startDate = dateToUnix(startDate);
    endDate = dateToUnix(endDate);

    let currTime = +new Date;
    currTime = ~~(currTime / 1000); // operator ~~ ukloni sve posle zareza (~~5.5 === 5, ~~-5.5 === -5)
    
    if(currTime >= startDate && currTime <= endDate) return true;

    return false;
}

let data = JSON.parse('{"buildings":[{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":11}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":["statue"],"money":2067026320,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":5770,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0d"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":14,"educated":11,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"highEducation","count":0,"completed":false},{"key":"skyCity","count":0,"completed":false},{"key":"check4","count":0,"completed":false},{"key":"greenCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false}],"income":358216,"score":2069533832}');
console.log(suburbia(data));

exports.rewardTypes = rewardTypes; 
exports.achievements = achievements; 
exports.dateToUnix = dateToUnix;
exports.checkIfActive = checkIfActive;