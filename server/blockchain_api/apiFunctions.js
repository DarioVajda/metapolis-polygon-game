let ethers = require("ethers");
let fs = require("fs");
let _ = require("lodash");

let buildingStats = require('../gameplay/building_stats');
let incomeModule = require('../gameplay/income');
let utils = require('./utils');
let achievements = require('./achievements');
let getFunctions = require('./getFunctions');


/* FUNCTION RULES:

PARAMETERS:
===========
CHECK(
    city - same format as the 'formatBuildingList' functions return object
    offers - list of offers (formated like the list returned by the /specialtype/:type endpoint)
    args - the same as the body of the post request ( / {signature, message} )
)
    
PREVIEW(
    city - same format as the 'formatBuildingList' functions return object
    offers - list of offers (formated like the list returned by the /specialtype/:type endpoint)
    args - the same as the body of the post request ( / {signature, message} )
)

SAVE(
    contract - ethers.Contract (the Gameplay smart contract)
    args - the same as the body of the post request ( / {signature, message} )
)

RETURN:
=======
CHECK - Boolean
PREVIEW - Object {
    city: (formated as the 'formatBuildingList' functions return object)
    offers: ...
}
SAVE - ne znam jos...

* 'completed' functions will require some different arguments because of the Achievements smart contract












checks:
    subtract the amount of money that is in the offers
    check if there is enough money to perform all the instructions


instructions (potentially interfering instructions if they are performed on the same building):
    build, (upgrade, rotate), remove
        1 + 2     --> error (frontend should send the data for building already with the appropriate level and rotation)
        1 + 3     --> error (frontend should just revert the build method without any costs)
        2 + 3     --> error (frontend should revert the upgrade and rotate methods before pushing the remove method to the list)
        1 + 2 + 3 --> error (frontend should just revert the build, rotate and upgrade methods without any costs)
    buildspecial, rotatespecial, removespecial
        1 + 2     --> error (frontend should send the data for building already with the appropriate rotation)
        1 + 3     --> error (frontend should just revert the build method without any costs)
        2 + 3     --> error (2 is irrelevant and should not have been sent to the server)
        1 + 2 + 3 --> error (frontend should just revert the build and rotate methods without any costs)
    completed
        giving the rewards to the person if achievement is completed
    
    *** prices that are sent to the contract should be 0, and at the end the money should be set to the correct value to avoid problems



specialoffer
    making the special offer if there i enough money to do so
    frontend asks for the signature and immediately sends it to the server on the '.../specialoffer' endpoint







*/

const functions = {
    build: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building } = body;
            building.id = -1;
            console.log('build', building);
            
            // proverava se format argumenta
            if(utils.isBuildingFormat(building) === false) {
                console.log('building format');
                return false;
            }
            // proveravaju se preklapanja
            if(utils.doesOverlap(building, city)) {
                console.log('building overlap');
                return false;
            }

            // proverava se level gradjevine
            if(building.level >= buildingStats.buildingStats.get(building.type).length) {
                console.log('building level higher than max level');
                return false;
            }
        
            // izvlaci se cena
            let cost = buildingStats.buildingStats
                .get(building.type) // dobija se lista levela i podataka o levelima
                .slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
                .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno
            if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
                cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
            }

            // provera se da li ima dovoljno novca
            if(cost > city.money) {
                console.log('not enough money');
                return false;
            }

            city.money -= cost;
            city.buildings.push(building);
            
            console.log('success');
            return { city, specialTypeData, achievementList };
            
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building } = body;

            let tx = await contract.addBuilding(
                id,
                building.start.x,
                building.start.y,
                building.end.x,
                building.end.y,
                building.orientation,
                building.level,
                building.type,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    buildspecial: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building, throughOffer } = body;
            building.id = -1;

            // proverava se format gradjevine
            if(utils.isSpecialBuildingFormat(building) === false) {
                console.log('special building format');
                return false;
            }
            // proverava se da li se gradjevina pleklapa sa nekom koja vec postoji
            if(utils.doesOverlap(building, city)) {
                console.log('special building overlap');
                return false;
            }
        
            // dobija se cena gradjevine u zavisnosti od toga da li je kupljeno kroz offer ili ne
            let cost;
            let cashIndex = 0;
            if(throughOffer === false) {
                // proverava se da li je gradjevina rasprodata
                if(specialTypeData[building.type].count === 0) {
                    console.log('special building sold out');
                    return false;
                }
                cost = buildingStats.specialPrices.get(building.type);
            }
            else {
                // proverava se da li postoji ovaj tip gradjevine u cash-u
                cashIndex = city.specialBuildingCash.indexOf(building.type);
                if(cashIndex === -1) {
                    console.log('special building not cashed');
                    return false;
                }

                let tempIndex = -1; // index of the highest offer the person made (because the biggest offer is always accepted)
                specialTypeData[building.type].offers.forEach((element, index) => {
                    if(parseInt(element.user) === parseInt(id) && element.filled === true && (tempIndex === -1 || element.value > specialTypeData[building.type].offers[tempIndex].value) ) {
                        tempIndex = index;
                    }
                });
                if(tempIndex === -1) {
                    console.log('no offers made by the user')
                    return false;
                }
                cost = specialTypeData[building.type].offers[tempIndex].value;
            }
        
            if(cost > city.money) {
                console.log('not enough money');
                return false;
            }
        
            city.specialBuildings.push(building);
            city.money -= cost;

            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building, throughOffer } = body;

            let tx = await contract.addSpecialBuilding(
                id,
                building.start.x,
                building.start.y,
                building.end.x,
                building.end.y,
                building.orientation,
                building.type,
                throughOffer,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    upgrade: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building, deltaLevel } = body;

            let index = city.buildings.reduce((prev, curr, i) => curr.id === building.id ? i : prev, -1);

            if(index === -1) {
                console.log('building id not found');
                return false;
            }
            
            // checking format
            if((utils.isBuildingFormat(building) && _.isEqual({ ...building, level: city.buildings[index].level }, city.buildings[index])) === false) {
                console.log('wrong format / does not match');
                return false;
            }

            // checking max level
            if(building.level + deltaLevel >= buildingStats.buildingStats.get(building.type).length) {
                console.log('trying to upgrade too many levels');
                return false;
            }

            let cost = buildingStats.buildingStats
                .get(building.type)
                .slice(building.level+1, building.level+deltaLevel+1)
                .reduce((prev, curr) => prev + curr.cost, 0);
            if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
                cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
            }

            if(city.money < cost) {
                console.log('not enough money');
                return false;
            }

            city.buildings[index].level = city.buildings[index].level + deltaLevel;
            city.money -= cost;
            
            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building, deltaLevel } = body;

            // TODO ovo je privremeno resenje dok ne napravim u smart contractu da moze da se poveca level za vise od 1 samo jednim pozivom funkcije
            for(let i = 0; i < deltaLevel - 1; i++) {
                let tempTx = await contract.upgradeBuilding(
                    id,
                    building.id,
                    { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
                );
                await tempTx.wait();
            } 

            let tx = await contract.upgradeBuilding(
                id,
                building.id,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    remove: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building } = body;
            const RETURN_PERCENTAGE = 0.5;
            console.log('remove', building);

            let index = city.buildings.reduce((prev, curr, i) => curr.id === building.id ? i : prev, -1);

            console.log(city);
            console.log(city.buildings[index]);

            if(index === -1) {
                console.log('building id not found');
                return false;
            }

            if((utils.isBuildingFormat(building) && _.isEqual(building, city.buildings[index])) === false) {
                console.log('wrong format / does not match');
                return false;
            }

            // Povracaj novca za uklonjenu gradjevinu
            let value = RETURN_PERCENTAGE * buildingStats.buildingStats
                .get(building.type) // dobija se lista levela i podataka o levelima
                .slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
                .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno
            if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
                value *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
            }

            // Uklanjanje gradjevine sa liste objekata
            city.buildings[index] = city.buildings[city.buildings.length - 1];
            city.buildings.pop();
            city.money += value;

            
            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building } = body;

            let tx = await contract.removeBuilding(
                id,
                building.id,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    removespecial: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building, throughOffer, expectedValue } = body;
            const MIN_RETURN_PERCENTAGE = 0.5;

            let index = city.specialBuildings.reduce((prev, curr, i) => curr.id === building.id ? i : prev, -1);
        
            if(index === -1) {
                console.log('special building id not found');
                return false;
            }

            if(utils.isSpecialBuildingFormat(building) == false && _.isEqual(building, city.specialBuildings[index])) {
                console.log("Bad format or not the same building!");
                return false;
            }

            let value;
            if(throughOffer === false) {
                let maxCount = buildingStats.specialTypes[building.type].count;
                let currCount = specialTypeData[building.type].count;
                let returnPercentage = MIN_RETURN_PERCENTAGE + (1 - MIN_RETURN_PERCENTAGE) * (maxCount - currCount) / maxCount;
                value = returnPercentage * buildingStats.specialPrices.get(building.type);
            }
            else {
                let tempOffers = specialTypeData[building.type].offers.map((element, index) => ({ ...element, index }));
                let offers = tempOffers.filter(element => element.user !== id && element.filled === false);
                if(offers.length === 0) {
                    console.log('no offers');
                    return false;
                }
                let offer = offers.reduce(
                    (max, curr) => {
                        if(max.value > curr.value) return max
                        else return {
                            value: curr.value,
                            index: curr.index
                        }
                    },
                    { value: 0, index: -1 }
                )
                
                value = offer.value;
    
                // uklanjanje ponude sa liste
                specialTypeData[building.type].offers[offer.index] = specialTypeData[building.type].offers[specialTypeData[building.type].offers.length - 1];
                specialTypeData[building.type].offers.pop();
            }
            
            // Uklanjanje specijalne gradjevine sa liste
            city.specialBuildings[index] = city.specialBuildings[city.specialBuildings.length - 1];
            city.specialBuildings.pop();
            city.money += value;

            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building, expectedValue, throughOffer } = body;

            // getting data about the highest offer:
            let user = 0;
            let value = 0;
            if(throughOffer) {
                let tempOffers = specialTypeData[building.type].offers.map((element, index) => ({ ...element, index }));
                let offers = tempOffers.filter(element => element.user !== id && element.filled === false);
                if(offers.length === 0) {
                    console.log('no offers');
                    return false;
                }
                let offer = offers.reduce(
                    (max, curr) => {
                        if(max.value > curr.value) return max
                        else return {
                            value: curr.value,
                            index: curr.index
                        }
                    },
                    { value: 0, index: -1 }
                );
                
                value = offer.value;
                user = tempOffers[offer.index].user;
            }

            let tx = await contract.removeSpecialBuilding(
                id,
                building.id,
                throughOffer,
                user,
                value,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    rotate: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building, rotation } = body;

            let index = city.buildings.reduce((prev, curr, i) => curr.id === building.id ? i : prev, -1);

            if(index === -1) {
                console.log('building id not found');
                return false;
            }
            
            // checking format
            if((utils.isBuildingFormat(building) && _.isEqual(building, city.buildings[index])) === false) {
                console.log('wrong format / does not match');
                return false;
            }

            city.buildings[index].orientation = rotation;

            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building, rotation } = body;

            let tx = await contract.rotate(
                id,
                building.id,
                rotation,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    rotatespecial: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { building, rotation } = body;

            let index = city.specialBuildings.reduce((prev, curr, i) => curr.id === building.id ? i : prev, -1);

            if(index === -1) {
                console.log('building id not found');
                return false;
            }
            
            // checking format
            if((utils.isSpecialBuildingFormat(building) && _.isEqual(building, city.specialBuildings[index])) === false) {
                console.log('wrong format / does not match');
                return false;
            }

            city.buildings[index].orientation = rotation;

            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { building, rotation } = body;

            let tx = await contract.rotateSpecial(
                id,
                building.id,
                rotation,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            );
            console.log({tx});
            return tx;
        }
    },
    completed: {
        check: (id, city, specialTypeData, achievementList, numOfNfts, body) => {
            let { achievement } = body;

            // checking if achievement key exists
            if( !achievements.achievements[achievement] ) return false;

            // checking if the achievement is active
            if( !achievements.checkIfActive(achievements.achievements[achievement]) ) return false;

            // checking if the person completed the achievement
            let completed = achievements.achievements[achievement].checkFunction(city);
            if(completed.completed === false) return false;

            // getting the new version of the city
            city = achievements
                .rewardTypes[achievements.achievements[achievement].rewardType]
                .preview(city, achievements.achievements[achievement].rewardValue)

            // setting the completed field to true
            achievementList.forEach((element, index) => {

                // checking if the max number of people completed the achievement
                if(element.count > achievements.achievements[achievement].percentage * numOfNfts) {
                    return false;
                }

                if(element.key === achievement) {
                    achievementList[i].completed = true;
                }
            });

            console.log('success');
            return { city, specialTypeData, achievementList };
        },
        save: async (id, contract, specialTypeData, body) => {
            let { achievement, achievementContract } = body;

            let rewardType = achievements.rewardTypes[achievements.achievements[achievement].rewardType]
            // await rewardType.receive(id, contract, achievements.achievements[achievement].rewardValue);

            let wethValue = rewardType.key === 'weth' ? achievements.achievements[achievement].rewardValue : 0;
            let maticValue = rewardType.key === 'matic' ? achievements.achievements[achievement].rewardValue : 0;

            let tx = await achievementContract.completedAchievement(
                id, 
                achievement, 
                wethValue, 
                maticValue,
                { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
            ); // here should be the values of weth and matic tokes that should be received for completing the achievement

            return tx;
        }
    }
}

const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function loadData(contract, achievementContract, id) {

    let city = undefined;

    const loadCityData = async () => {
        let res = await getFunctions.getCityData(id, contract, achievementContract);
        city = res;
    }
    loadCityData()

    let specialTypeData = {};
    const loadOffer = async (type) => {
        let data = await contract.getSpecialBuildingType(type);
        data = {
            count: data.count.toNumber(),
			numOfOffers: data.numOfOffers.toNumber(),
			rarity: data.rarity.toNumber(),
			soldOut: data.soldOut,
			offers: data.offers
		}
		data.offers = data.offers.map((element, index) => ({
            value: element.value.toNumber(),
			user: element.user.toNumber(),
			filled: element.filled,
			index: index
		}));
        specialTypeData[type] = data;
    }

    Object.values(buildingStats.specialTypes).forEach(element => {
        loadOffer(element.type);
    });

    let numOfNfts = -1;
    const loadNumOfNFts = async () => {
        let res = await contract.getNumOfPlayers();
        numOfNfts = parseInt(res._hex, 16);
    }
    loadNumOfNFts();

    // ceka se dok se ne ucitaju svi podaci koji su potrebni
    while(city === undefined || Object.keys(specialTypeData).length < Object.keys(buildingStats.specialTypes).length || numOfNfts === -1) {
        await delay(50);
    }

	let achievementList = city.achievementList;

    return { city, specialTypeData, achievementList, numOfNfts };

}

const instructionsApi = async (contract, achievementContract, id, instructions) => {
    let { city, specialTypeData, achievementList, numOfNfts } = await loadData(contract, achievementContract, id);
    const ogSpecialTypeData = JSON.parse(JSON.stringify(specialTypeData));

    // #region checks

    let temp;
    for(let i = 0; i < instructions.length; i++) {
        temp = functions[instructions[i].instruction].check(id, city, specialTypeData, achievementList, numOfNfts, instructions[i].body);
        if(temp === false) {
            return {
                status: 400,
                message: `bad request - ${instructions[i].instruction}`,
                errors: []
            };
        }
        city = temp.city;
        specialTypeData = temp.specialTypeData;
        achievementList = temp.achievementList;
    }

    let newMoneyValue = city.money;

    console.log({ newMoneyValue });

    // #endregion

    // #region saving the data

    let instructionCount = instructions.length;
    let errors = [];

    const saveFunctionCall = async (tx, instruction, body) => {
        let receipt;
        try {
            receipt = await tx.wait();
        }
        catch(e) {
            console.log(e);
            errors.push({ instruction, body });
        }

        instructionCount--;
    }

    // calling the save functions
    for(let i = 0; i < instructions.length; i++) {
        let element = instructions[i];

        let tempBody = element.body;
        if(element.instruction === 'completed') {
            tempBody = { ...tempBody, achievementContract };
        }
        
        let tx = await functions[element.instruction].save(id, contract, ogSpecialTypeData, element.body);
        saveFunctionCall(tx, element.instruction, element.body);
        await delay(1e3);
    }

    // waiting for the save functions to execute
    while(instructionCount > 0) {
        process.stdout.write(`${instructionCount} `);
        await delay(100);
    }

    if(errors.length === 0) {
        // setting the money value for the player
        let tx = await contract.devSetMoney(
            id, 
            newMoneyValue, 
            { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
        );
        console.log({tx});
        try {
            await tx.wait();
        }
        catch(e) {
            errors.push({ instruction: 'setmoney', error: e, message: 'fail' });
        }

        // setting the score for the player
        let newScore = newMoneyValue + 7 * incomeModule.calculateIncome(city);
        tx = await contract.changeScore(
            id,
            newScore,
            { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }    
        );
        console.log({tx});
        try {
            await tx.wait();
        }
        catch(e) {
            errors.push({ instruction: 'setscore', error: e, message: 'fail' });
        }
    }

    // response
    if(errors.length === 0) return {
        status: 200,
        message: 'success',
        errors: []
    }
    else return {
        status: 500,
        message: 'fail',
        errors: errors
    }

    // #endregion

}

// instructionsApi();

exports.instructionsApi = instructionsApi;