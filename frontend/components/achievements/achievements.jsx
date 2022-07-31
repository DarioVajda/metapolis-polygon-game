

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

const rewardTypes = {
    // ingame rewards:
    money: {
        key: 'money',
        receive: async (id, value) => {
            
        },
        preview: (city, value) => {
            city.money = city.money + value;
            return city;
        }
    },
    boost: {
        key: 'boost',
        receive: async (id, value) => {
            
        },
        preview: (city, value) => {
            city.income = city.income * value;
            return city;
        }
    },
    extraEducated: {
        key: 'extraEducated',
        receive: async (id, value) => {
            
        },
        preview: (city, value) => {
            return city;
        }
    }, // every building has extra educated people instead of an uneducated

    // other rewards:
    eth: {
        key: 'eth',
        receive: async (id, value) => {
            
        },
        preview: (city, value) => {
            return city;
        }
    },
    matic: {
        key: 'matic',
        receive: async (id, value) => {
            
        },
        preview: (city, value) => {
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
    const MIN_EDUCATED_PERCENTAGE = 60;
    
    let people = city.educated + city.normal;
    let educated = city.educated;

    let completed = (people >= MIN_PEOPLE) && (educated / people >= MIN_EDUCATED_PERCENTAGE / 100)
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

    let value = Math.min((educated / people) / (MIN_EDUCATED_PERCENTAGE / 100), 1) * Math.min(people / MIN_PEOPLE, 1);

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

    // console.log(r);

    return r;
};
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
        rewardValueJsx: <>+5%</>,
        rewardType: rewardTypes.boost.key,
        percentage: 0.05
    },
    educatedCity: {
        checkFunction: educatedCity,
        title: 'Educated City',
        explanation: 'Have a 60% educated city with a population size of at least 500',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: null,
        rewardValueJsx: <div style={{fontSize:'1.2rem',backgroundColor:'transparent'}}>BOOST</div>,
        rewardType: rewardTypes.extraEducated.key,
        percentage: 0.05
    },
    skyCity: {
        checkFunction: skyCity,
        title: 'Break the sky',
        explanation: 'Build at least 20 skyscrapers (level 2 buildings).',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 500000,
        rewardValueJsx: <>500000</>,
        rewardType: rewardTypes.money.key,
        percentage: 0.025
    },
    check4: {
        checkFunction: check4,
        title: 'check4',
        explanation: 'This is the check4.',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2023 09:25:32',
        rewardValue: 100,
        rewardValueJsx: <>100</>,
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

export { rewardTypes, achievements, checkIfActive };