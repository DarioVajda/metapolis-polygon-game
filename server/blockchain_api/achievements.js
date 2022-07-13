// #region require

let ethers = require("ethers");
let fs = require("fs");

let buildingStats = require('../gameplay/building_stats');
let mapModule = require('../gameplay/map');
let peopleModule = require('../gameplay/people');
let incomeModule = require('../gameplay/income');
let generateModule = require('../rand_map/generate');
let utils = require('./utils');
let postFunctions = require('./postFunctions');

let addressJSON = require('../../smart_contracts/contract-address.json');

// #endregion

// #region Contract

// connecting to the blockchain and other initializations
let provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
let wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
// console.log(wallet);
let contractAddress = addressJSON.gameplay;
// console.log(contractAddress)
let abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var account = wallet.connect(provider);
var contract = new ethers.Contract(
	contractAddress,
	abi,
	account
);

//#endregion

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

// Function getting the values from the contract
const getCityData = async (id) => {
    let cityData = await contract.getCityData(id);
	let city = utils.formatBuildingList(cityData);
    return city;
}

// #endregion


const rewardTypes = {
    // ingame rewards:
    money: 'money',
    boost: 'boost',
    extraEducated: 'extraEducated', // every building has extra educated people instead of an uneducated

    // other rewards:
    eth: 'eth',
    matic: 'matic'
}

// #region Check functions

const greenCity = (city) => {
    const MIN_SURFACE = 50;

    let buildings = city.buildings;

    let parks = buildings.filter(element => element.type === buildingStats.buildingTypes.Park);
    
    let surface = 0;
    parks.forEach(element => {
        surface += (element.end.x - element.start.x + 1) * (element.end.y - element.start.y + 1);
    });

    return surface >= MIN_SURFACE;
}

const educatedCity = (city) => {
    const MIN_PEOPLE = 500;
    const MIN_EDUCATED_PERCENTAGE = 60;
    
    let people = city.educated + city.normal;
    let educated = city.educated;

    return (people >= MIN_PEOPLE) && (educated / people >= MIN_EDUCATED_PERCENTAGE / 100);
}

const skyCity = (city) => {
    const MIN_SKYSCRAPERS = 20;
    const MIN_SKYSCRAPER_LEVEL = 0;

    let buildings = city.buildings;
    let numOfScyscrapers = 0;

    buildings.forEach(element => {
        if(element.type === buildingStats.buildingTypes.Building && element.level === MIN_SKYSCRAPER_LEVEL) {
            numOfScyscrapers += 1;
        }
    });

    return numOfScyscrapers > MIN_SKYSCRAPERS;
};
const check4 = (city) => true;

// #endregion

const funkcijaZaTestiranje = async () => {

    let data = await getCityData(0);
    // console.log(data);

    let x;

    // x = greenCity(data);
    // x = educatedCity(data);
    // x = skyCity(data);
    // x = check4(data);

    console.log(x);
}

// funkcijaZaTestiranje();

const achievements = {
    greenCity: {
        check: greenCity,
        title: 'Green City',
        explanation: 'Cover at least 50 sqares with parks.',
        startDate: '09/24/2022 09:25:32',
        endDate: '10/24/2022 09:25:32',
        rewardValue: 1.05,
        rewardType: rewardTypes.boost,
        percentage: 0.05
    },
    educatedCity: {
        check: educatedCity,
        title: 'Educated City',
        explanation: 'Have a 60% educated city with a population size of at least 500',
        startDate: '09/24/2021 09:25:32',
        endDate: '10/24/2022 09:25:32',
        rewardValue: 1,
        rewardType: rewardTypes.extraEducated,
        percentage: 0.05
    },
    skyCity: {
        check: skyCity,
        title: 'Break the sky',
        explanation: 'Build at least 20 skyscrapers (level 2 buildings).',
        startDate: '09/24/2022 09:25:32',
        endDate: '10/24/2022 09:25:32',
        rewardValue: 500000,
        rewardType: rewardTypes.money,
        percentage: 0.025
    },
    check4: {
        check: check4,
        title: 'check4',
        explanation: 'This is the check4.',
        startDate: '09/24/2022 09:25:32',
        endDate: '10/24/2022 09:25:32',
        rewardValue: 100,
        rewardType: rewardTypes.matic,
        percentage: 0.005
    },
}

const checkIfActive = ({ startDate, endDate }) => {
    startDate = dateToUnix(startDate);
    endDate = dateToUnix(endDate);

    let currTime = +new Date;
    currTime = ~~(currTime / 1000); // ~~ ukloni sve posle zareza (~~5.5 === 5, ~~-5.5 === -5)
    
    if(currTime >= startDate && currTime <= endDate) return true;

    return false;
}


// console.log(checkIfActive(achievements.check1));
// console.log(checkIfActive(achievements.educatedCity));

// console.log('09/24/2022 09:25:32');
// console.log(dateToUnix('09/24/2022 09:25:32'));

exports.rewardTypes = rewardTypes;
exports.achievements = achievements;
exports.checkIfActive = checkIfActive;