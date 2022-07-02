let ethers = require("ethers");
let fs = require("fs");

let buildingStats = require('../gameplay/building_stats');
let mapModule = require('../gameplay/map');
let peopleModule = require('../gameplay/people');
let incomeModule = require('../gameplay/income');
let utils = require('./utils');

let addressJSON = require('../../smart_contracts/contract-address.json');

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

// #region functions

const build = async (body, id) => {

    let building = body.building;
	let cityData = await contract.getCityData(id);
	let city = utils.formatBuildingList(cityData);
	
	let cost = buildingStats.buildingStats.get(building.type)[0].cost;
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}
	
	if(utils.isBuildingFormat(building) === false) {
		// res.status(400).send("Bad format!");
		return {
            status: 400,
            message: "Bad format!"
        };
	}
	if(building.level !== 0) {
		// res.status(400).send("Building is not level 1!");
		return {
            status: 400,
            message: "Building is not lever 1!"
        };
	}
	if(utils.doesOverlap(building, city)) {
		// res.status(400).send("Building overlaps!");
		return {
            status: 400,
            message: "Building overlaps!"
        };
	}
	if(cost > city.money) {
		// res.status(400).send("Not enough money to build!");
		return {
            status: 400,
            message: "Not enough money to build!"
        };
	}
	
	// calling the function that adds a building to the list
	let tx = await contract.addBuilding(
		id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.orientation,
		building.type,
		{ gasLimit:5e6, maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 }
	);
	let receipt;
	try {
		receipt = await tx.wait();
		console.log(receipt);
	}
	catch(e) {
		console.log(e);
        return {
            status: 500,
            message: `${e}` 
        }
	}

	// calling the function that changes the score
	cityData = await contract.getCityData(id);
	city = utils.formatBuildingList(cityData);
	let income;
	let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
	let people = peopleModule.countPeople({normal: city.buildings} , map);
	income = incomeModule.calculateIncome(people, {normal: city.buildings} );
	
	// console.log('INCOME:', income);
	let score = city.money + 7*income;
	// console.log('NEW SCORE:', score);
	tx = await contract.changeScore(id, score, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
	try {
		receipt = await tx.wait();
		console.log(receipt);
		// res.status(200).send(receipt);
		return { status: 200 };
	}
	catch(e) {
		console.log(e);
        return {
            status: 500,
            message: `${e}` 
        }
	}
}

const buildspecial = async (body, id) => {
	let building = body;
	let cityData = await contract.getCityData(id);
	let city = utils.formatBuildingList(cityData);

	let cost = buildingStats.specialPrices[building.type];

	if(utils.isSpecialBuildingFormat(building) == false) {
		// res.status(400).send("Bad format!");
		return {
            status: 400,
            message: "Bad format!"
        };
	}
	if(utils.doesOverlap(building, city)) {
		// res.status(400).send("Building overlaps!");
		return {
            status: 400,
            message: "Building overlaps!"
        };
	}
	if(cost >= city.money) {
		// res.status(400).send("Not enough money to build!");
		return {
            status: 400,
            message: "Not enough money to build!"
        };
	}

	let tx = await contract.addSpecialBuilding(
		id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.orientation,
		building.type,
		{ maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 }
	);
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		// res.status(200).send(receipt);
		return { status: 200 };
	}
	catch(e) {
		console.log(e);
		// res.status(400).send(e);
		return {
            status: 500,
            message: `${e}`
        };
	}
}

const upgrade =  async (body, id) => {
	let index = body.index; // integer
	let building = body.building; // 'Building' object
	let cityData = await contract.getCityData(id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(!city[index]) {
		return {
            status: 400,
            message: "Ivalid index"
        }
	}

	let message = body.message;
	let signature = body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		return {
            status: 400,
            message: "The caller of this function must be the owner of the NFT"
        };
	}

	let cost = buildingStats.buildingStats.get(building.type)[building.level].cost; // getting the cost of upgrading to the next level
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}

	if(utils.isBuildingFormat(building) && utils.isSameBuilding(building, city[index])) {
		let tx = await contract.upgradeBuilding(
			id,
			cost,
			index,
			{ maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 }
		);
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
		}
		catch(e) {
			console.log(e);
			// res.status(400).send(e);
			return {
                status: 500,
                message: `${e}`
            };
		}

		cityData = await contract.getCityData(id);
		city = utils.formatBuildingList(cityData);
		let income;
		let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city.buildings} , map);
		income = incomeModule.calculateIncome(people, {normal: city.buildings} );

		tx = await contract.changeScore(id, city.money + 7*income, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
		try {
			receipt = await tx.wait();
			console.log(receipt);
			// res.status(200).send(receipt);
			return { status: 200 };
		}
		catch(e) {
			console.log(e);
			// res.status(400).send(e);
			return {
                status: 500,
                message: `${e}`
            };
		}
	}
	else {
		// res.status(400).send("Data sent is not correct");
        return {
            status: 400,
            message: "Data sent is not correct"
        }
	}
}

const remove = async (body, id) => {
	let index = body.index; // integer
	let building = body.building; // 'Building' object
	let cityData = await contract.getCityData(id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(city[index] === undefined) {
		console.log('invalid index');
		// res.status(400).send("Ivalid index");
		return {
            status: 400,
            message: "Invalid index"
        };
	}

	let message = body.message;
	let signature = body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		console.log('the caller of this function must be the owner of the nft');
		// res.status(400).send("The caller of this function must be the owner of the NFT");
		return {
            status: 400,
            message: "The caller of this function must be the owner of the NFT"
        }; 
	}
	
	let returnPercentage = 0.5;
	let value = returnPercentage * buildingStats.buildingStats.get(building.type)[building.level].cost;
	
	console.log(utils.isSameBuilding(building, city[index]))
	console.log(utils.isBuildingFormat(building))
	if(utils.isSameBuilding(building, city[index]) && utils.isBuildingFormat(building)) {

		console.log({id,value,index});
		let tx = await contract.removeBuilding(
			id,
			value,
			index,
			{ maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 }
		);
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
		}
		catch(e) {
			console.log(e);
			// res.status(400).send(e);
			return {
                status: 500,
                message: `${e}`
            };
		}

		cityData = await contract.getCityData(id);
		city = utils.formatBuildingList(cityData).buildings;
		console.log(city);

		cityData = await contract.getCityData(id);
		city = utils.formatBuildingList(cityData);
		let income;
		let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city.buildings} , map);
		income = incomeModule.calculateIncome(people, {normal: city.buildings} );

		tx = await contract.changeScore(id, city.money + 7*income, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
		try {
			receipt = await tx.wait();
			console.log(receipt);
			// res.status(200).send(receipt);
			return { status: 200 };
		}
		catch(e) {
			console.log(e);
			// res.status(400).send(e);
			return {
                status: 500,
                message: `${e}`
            };
		}
	}
	else {
		console.log('data sent is not correct');
		// res.status(400).send("Data sent is not correct");
        return {
            status: 400,
            message: "Data sent is not correct"
        }
	}
}

const removespecial = async (body, id) => {
	let index = body.index;

	let building = body.building;
 
	// TODO treba da se napravi provera da li je postlati building isti kao sto je onaj u contractu

	let returnPercentage = 0.25;
	let value = returnPercentage * buildingStats.specialPrices.get(building.specialType); // treba da se uzme vrednost odgovarajuceg tipa gradjevina

	let tx = await contract.removeSpecialBuilding(id, value, index, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
	try {
		let receipt = await tx.wait();
		// res.status(200).send(receipt);
		return { status: 200 };
	}
	catch(e) {
		// res.status(400).send('error in the smart contract function call');
		return {
            status: 500,
            message: "error in the smart contract function call"
        };
	}
}

const rotate = async (body, id) => {
	let data = body;
	
	// neke provere...

	let tx = await contract.rotate(id, data.index, data.rotation, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		// res.status(200).send(receipt);
		return { status: 200 };
	}
	catch(e) {
		// res.status(400).send(e);
		return {
            status: 500,
            message: `${e}`
        };
	}
}

const rotatespecial = async (body, id) => {
	let data = body;
	
	// neke provere...

	let tx = await contract.rotateSpecial(id, data.index, data.rotation, { maxPriorityFeePerGas: 3e9, maxFeePerGas: 3.5e9 });
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		// res.status(200).send(receipt);
		return { status: 200 };
	}
	catch(e) {
		// res.status(400).send(e);
		return {
            status: 500,
            message: `${e}`
        };
	}
}

// #endregion


const functions = {
    build: async (body, id) => {
        console.log('build', { body, id });
        let res;
        try {
            res = await build(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    buildspecial: async (body, id) => {
        console.log('buildspecial', { body, id });
        let res;
        try {
            res = await buildspecial(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    upgrade: async (body, id) => {
        console.log('upgrade', { body, id });
        let res;
        try {
            res = await upgrade(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    remove: async (body, id) => {
        console.log('remove', { body, id });
        let res;
        try {
            res = await remove(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    removespecial: async (body, id) => {
        console.log('removespecial', { body, id });
        let res;
        try {
            res = await removespecial(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    rotate: async (body, id) => {
        console.log('rotate', { body, id });
        let res;
        try {
            res = await rotate(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    },
    rotatespecial: async (body, id) => {
        console.log('rotatespecial', { body, id });
        let res;
        try {
            res = await rotatespecial(body, id);
        }
        catch(e) {
            res = { status: 500, message: e }
        }
        return res;
    }
}

exports.functions = functions;