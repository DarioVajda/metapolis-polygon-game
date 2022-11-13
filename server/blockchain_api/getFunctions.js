const utils = require('./utils');
const achievements = require('./achievements');
const incomeModule = require('../gameplay/income');


const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * @dev Async function loading data about the achievements
 * @param {Number}          id                  of the city you are fetching the data for 
 * @param {ethers.Contract} achievementContract the reference to the achievement contract
 * @returns {{ key: String, count: Number, completed: Boolean }[]} an array containing an element for every achievement (key, number of people who completed the achievement and a boolean indicating if the id-th player completed it)
 */
async function loadAchievements(id, achievementContract) {
    let keyList = Object.keys(achievements.achievements);
	let dataList = [];

	const loadAchievementData = async (key) => {
		let count = await achievementContract.getAchievementCount(key);
		let completed = await achievementContract.checkIfCompleted(id, key);
		dataList.push({
			key: key,
			count: count,
			completed: completed
		})
	}

	for(let i = 0; i < keyList.length; i++) {
		loadAchievementData(keyList[i]);
	}

	while(dataList.length < keyList.length) {
		await delay(50);
	}

    console.log({dataList});
    return dataList
}

/**
 * @dev getting all the data about the id-th city
 * @param {Number}          id                  of the city you are getting the data for
 * @param {ethers.Contract} contract            the reference to the gameplay contract
 * @param {ethers.Contract} achievementContract the reference to the achievement contract
 * @returns {{ 
 *      buildings: {
 *          start: {x:Number, y:Number},
 *          end: {x:Number, y:Number},
 *          type: String,
 *          level: Number,
 *          orientation: Number,
 *          id: Number
 *      }[],
 *      specialBuildings: {
 *          start: {x:Number, y:Number},
 *          end: {x:Number, y:Number},
 *          type: String,
 *          orientation: Number,
 *          id: Number
 *      }[],
 *      specialBuildingCash: String[],
 *      money: Number,
 *      income: Number,
 *      score: Number,
 *      owner: String,
 *      incomesReceived: Number,
 *      created: Boolean,
 *      initialized: Boolean,
 *      theme: Number,
 *      buildingId: Number,
 *      specialBuildingId: Number,
 *      normal: Number,
 *      educated: Number,
 *      normalWorkers: Number,
 *      educatedWorkers: Number,
 *      achievementList: {
 *          key: String,
 *          count: Number,
 *          completed: Boolean
 *      }[]
 * }}
 */
async function getCityData(id, contract, achievementContract) {

    let data = {}

    const getFromCityContract = async () => {
        let res = await contract.getCityData(id);
        data.city = utils.formatBuildingList(res);
    }

    const getFromAchievementContract = async () => {
        let res = await loadAchievements(id, achievementContract);
        // console.log({res})
        data.achievementList = res;
        // console.log({achievementList: data.achievementList})
    }


    getFromCityContract()
    getFromAchievementContract()

    while(data.city === undefined || data.achievementList === undefined) {
        await delay(50);
    }

    let income = incomeModule.calculateIncome(data.city, data.achievementList);
    // console.log({income, achievementList: data.achievementList});

    return { 
        ...data.city, 
        achievementList: data.achievementList,
        income: income,
        score: income*7+data.city.money
    };

}

exports.loadAchievements = loadAchievements;
exports.getCityData = getCityData;