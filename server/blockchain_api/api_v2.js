const express = require("express");
const ethers = require("ethers");
const fs = require("fs");

const buildingStats = require('../gameplay/building_stats');
const incomeModule = require('../gameplay/income');
const generateModule = require('../rand_map/generate');
const utils = require('./utils');
// const postFunctions = require('./postFunctions');
const achievements = require('./achievements');
const apiFunctions = require('./apiFunctions');
const getFunctions = require('./getFunctions');

const puppeteer = require('../test/puppeteer');

const addressJSON = require('../../smart_contracts/contract-address.json');

// #region Contract
// connecting to the blockchain and other initializations
let provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
let wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
console.log(wallet);
let account = wallet.connect(provider);

let contractAddress = addressJSON.gameplay;
console.log(contractAddress);
let abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
let contract = new ethers.Contract(
	contractAddress,
	abi,
	account
);

let achievementContractAddress = addressJSON.achievements;
let achievementAbi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Achievements.json").toString().trim()).abi;
let achievementContract = new ethers.Contract(
	achievementContractAddress,
	achievementAbi,
	account
);

let app = express();
let port = 8000;

let cors=require("cors");
const { type } = require("os");
let corsOptions ={
	origin:'*', 
	credentials:true,
	optionSuccessStatus:200,
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions))

//#endregion
// #region NFT GET requests

app.get("/cities/:id", (req, res) => {
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	res.json({
		name: `City #${id}`,
        description: "This is an image of a city that it's owners built",
        image: `http://localhost:8000/cities/${id}/image.png`, // this is going to be a different url
        external_url: `https://docs.openzeppelin.com/contracts/4.x/erc721` // this is going to be something else
    });
}); // DONE (for now)

app.get("/cities/:id/image.png", async (req, res) => {
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	// Checking if an image is already saved on backend
	if (fs.existsSync(`../test/images/city_${id}.png`)) {

		// file exists and it is not neccessary to render it one more time
	  	console.log('file exists and it is neccessary to render');
  	}	
	else {
		
		// file does not exist and it is neccessary to render it
		console.log('file does not exist and it is neccessary to render');	
		
		// getting the data about the city
		let city = await getFunctions.getCityData(id, contract, achievementContract);
		console.log(city);

		// checking if the city was created and initialized
		if(city.created === false) {
			res.status(400).send('not created');
		}
		else if(city.initialized === false) {
			res.status(400).send('not initialized');
		}

		// saving the image of the city on the backend
		let image = await puppeteer.saveImage(city, id, { resolution: 1000 });
		console.log(image);
	}
	
	// console.log(`/cities/${id}/city-image`);
	// console.log(`data:image/jpeg;base64,${image.toString('base64')}`);
	res.sendFile(`C:/Users/Dario Vajda/OneDrive/Documents/nft/server/test/images/city_${id}.png`);

	return;
	
	// #region drugo resenje

	// ovo je druga moguca opcija za resenje problema, ali mislim da je bolje bolje to sto se sad koristi
	let url = `data:image/jpeg;base64,${image.toString('base64')}`;
	res.send(`<img src=${url} />`);
	
	// #endregion

}); // DONE (for now)

// #endregion
// #region GET requests

app.get("/leaderboard", async (req, res) => {
	let numOfPlayers = await contract.getNumOfPlayers();
	numOfPlayers = numOfPlayers.toNumber();
	if(numOfPlayers === 0) {
		res.send([]);
		return;
	}

	let temp; // objekat koji ce imati polja id i score kad se dobiju podaci sa contracta
	let leaderboard = [];

	const delay = async (time) => {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	const loadScore = async (i) => {
		temp = await contract.getScore(i);
		console.log({ id: i, score: temp[0].toNumber(), initialized: temp[1] });
		leaderboard.push({ id: i, score: temp[0].toNumber(), initialized: temp[1] });
	}

	for(let i = 0; i < numOfPlayers; i++) {
		loadScore(i);
	}

	while(leaderboard.length < numOfPlayers) {
		// console.log('waiting...', leaderboard.length, numOfPlayers);
		await delay(100);
	}

	let filtered = leaderboard.filter((item) => {
		return item.initialized === true;
	});

	// console.log('leaderboard (not sorted):', filtered.map((element) => { return {score: element.score} }));
	filtered.sort(function(a, b) { return b.score - a.score; });
	// console.log('leaderboard (sorted):', filtered.map((element) => { return {score: element.score} }));

	console.log('leaderboard: ', filtered);
	res.send(filtered);
}); // DONE

app.get("/count", async (req, res) => {
	let count = await contract.getNumOfPlayers();
	count = parseInt(count._hex, 16);
	res.send({count: count});
}); // DONE

app.get("/cities/:id/data", async (req, res) => {
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	let city = await getFunctions.getCityData(id, contract, achievementContract);
	res.send(city);
}); // DONE - have to add the orientation to the smart contract

app.get("/specialtype/:type", async (req, res) => {
	let data = await contract.getSpecialBuildingType(req.params.type);
	data = {
		count: data.count.toNumber(),
		rarity: data.rarity.toNumber(),
		soldOut: data.soldOut,
		offers: data.offers
	}
	data.offers = data.offers.map(element => ({
		value: element.value.toNumber(),
		user: element.user.toNumber(),
		filled: element.filled
	}));
	if(data.count === 0 && data.soldOut === false) {
		res.status(400).send({error: `Special type '${req.params.type}' does not exist`});
	}
	else {
		res.send({
			count: data.count,
			rarity: data.rarity,
			soldOut: data.soldOut,
			offers: data.offers
		});
	}
}); // DONE

app.get("/cities/:id/getincome", async (req, res) => {
	
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	// here could be some kind of a check if the player can receive income...

	let city = await getFunctions.getCityData(id, contract, achievementContract);

	let income = city.income

	let tx = await contract.getIncome(id, income, { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	console.log(tx);	

	try {
		let receipt = await tx.wait();
		console.log(receipt);
		console.log('Income received!');
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}

	cityData = await contract.getCityData(id);
	city = utils.formatBuildingList(cityData);

	tx = await contract.changeScore(id, city.money + 7*income, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
}); // DONE

// #endregion
// #region POST functions

app.post("/cities/:id/initialize", async (req, res) => {
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	if(req.body.address === undefined) {
		res.status(400).send("Problem with the request");
		return;
	}

	if(id < 0) {
		res.status(400).send("Index is smaller than 0");
		return;
	}

	let cityData = await contract.getCityData(id);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner;
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		console.log('The caller of this function must be the owner of the NFT');
		console.log('The real owner is ', signer);
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}
	console.log('Signature is correct');

	let buildings = generateModule.generateBuildings();
	let owner = req.body.address;
	let tokenId = id;

	let tx = await contract.initializeCity(
		owner, 
		tokenId, 
		0, // random theme...
		{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	); // initializing the theme, money and incomesReceived 
	try {
		console.log(tx);
		await tx.wait();
	}
	catch(e) {
		res.status(500).send(e);
		return;
	}
	console.log('initialize done');

	// #region adding the buildings

	let error = undefined;
	let transactionCount = buildings.normal.length + buildings.special.length;

	const waitForTx = async (tx) => {
		try {
			await tx.wait();
		}
		catch(e) {
			error = e;
		}
		transactionCount--;
	}

	const delay = async (time) => {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	let element;
	for(let i = 0; i < buildings.normal.length; i++) {
		element = buildings.normal[i];
		let tx = await contract.addBuilding(
			tokenId,
			element.start.x,
			element.start.y,
			element.end.x,
			element.end.y,
			element.orientation,
			0, // level
			element.type,
			{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
		);
		console.log(element);
		waitForTx(tx);
	}
	for(let i = 0; i < buildings.special.length; i++) {
		element = buildings.special[i];
		let tx = await contract.addSpecialBuilding(
			tokenId,
			element.start.x,
			element.start.y,
			element.end.x,
			element.end.y,
			element.orientation,
			element.type,
			false, // not through offer
			{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
		);
		console.log(element);
		waitForTx(tx);
	}

	while(transactionCount > 0) {
		await delay(50);
		if(error !== undefined) {
			res.status(500).send(error);
			return;
		}
	}

	// #endregion

	// inicijalizacija scora:
	cityData = await contract.getCityData(id);
	city = utils.formatBuildingList(cityData);
	console.log(city);
	
	let income = incomeModule.calculateIncome(city);

	console.log('new score: ', city.money + 7*income);
	tx = await contract.changeScore(id, city.money + 7*income, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
});

app.post("/cities/:id/instructions", async (req, res) => {

	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}
	
	console.log('instructions', 10000);
	let cityData = await contract.getCityData(id);

	try {
		let message = req.body.message;
		let signature = req.body.signature;
		let signer = cityData.cityOwner;
		let signerAddr = ethers.utils.verifyMessage(message, signature);
		if(signerAddr !== signer) {
			res.status(400).send("The caller of this function must be the owner of the NFT");
			console.log("The caller of this function must be the owner of the NFT");
			return;
		}
	}
	catch(e) {
		res.status(400).send("Message or signature not sent.");
		console.log("Message or signature not sent.");
		return;
	}

	let instructions = req.body.instructions;
	if(instructions === undefined || instructions.length === undefined) {
		res.status(400).send('List of instructions is not sent');
		console.log('List of instructions is not sent');
		return;
	}
	
	for(let i = 0; i < instructions.length; i++) {
		if(!instructions[i].instruction || !instructions[i].body) {
			res.status(400).send({ error: 'Wrong data format (instructions dont have body or instruction key' });
			console.log({ error: 'Wrong data format (instructions dont have body or instruction key' });
			return;
		}
	}

	let response = await apiFunctions.instructionsApi(contract, achievementContract, parseInt(id), instructions);
	console.log(response);

	res.status(response.status).send({ message: response.message, errors: response.errors });
});

app.post("/cities/:id/specialoffer", async (req, res) => {

	let id = id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	let city = await getFunctions.getCityData(id, contract, achievementContract);
	console.log(city);

	// checking if the request was sent from the owner of the NFT
	let message = req.body.message;
	let signature = req.body.signature;
	let signer = city.owner;
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}
	console.log('the caller of the function is the owner of the nft');

	let value = req.body.value; // the value of the offer
	let type = req.body.type; // the type of special buildings the offer was made for

	//////////// should check if the special building is sold out \\\\\\\\\\\\

	// checking if the player has enough money to make the offer
	if(value > city.money) {
		res.status(400).send("Not enough money to make the offer");
		return;
	}
	console.log('there is enough money to make the offer');

	let tx = await contract.makeSpecialOffer(
		type, 
		id, 
		value, 
		{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	);
	console.log({tx});
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		console.log('offer made successfully');
		res.status(200).send("Offer made successfully");
		return;
	}
	catch(e) {
		console.log('there was an error');
		console.log(e);
		res.status(500).send(e);
		return;
	}
});

app.post("/cities/:id/canceloffer", async (req, res) => {
	let id = req.params.id;
	if(typeof id && (id > 10_000 || id < 0 || id % 1 !== 0)) {
		res.status(400).send("bad id was sent");
		return;
	}

	let cityData = await contract.getCityData(id);
	// let city = utils.formatBuildingList(cityData);

	// checking if the request was sent from the owner of the NFT
	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner;
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		return res.status(400).send("The caller of this function must be the owner of the NFT");
	}

	let offerValue = req.body.value;
	let type = req.body.type;
	// let data = await contract.getSpecialBuildingType(type);
	// let id = parseInt(id);
	// if(data.offers[offerIndex].user.toNumber() !== id) {
	// 	console.log("Can't cancel an offer someone else made!");
	// 	res.status(400).send("Can't cancel an offer someone else made!");
	// 	return;
	// }

	let tx = await contract.cancelSpecialOffer(
		type, 
		id, 
		offerValue, 
		{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	);
	try {
		let receipt = await tx.wait();
		console.log('offer canceled');
		res.status(200).send(receipt);
	}
	catch(e) {
		res.status(500).send({ error: e, message: 'smart contract transaction failed' });
		console.log('offer canceling transaction failed');
		return;
	}
});

// #endregion



// #region DONT USE THIS

app.post("/cities/:id/build", async (req, res) => {
	let building = req.body.building;
	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner; // this address could be also sent in the body of the request
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}
	
	let cost = buildingStats.buildingStats.get(building.type)[0].cost;
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}
	
	if(utils.isBuildingFormat(building) === false) {
		res.status(400).send("Bad format!");
		return;
	}
	if(building.level !== 0) {
		res.status(400).send("Building is not level 1!");
		return;
	}
	if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
		return;
	}
	if(cost > city.money) {
		res.status(400).send("Not enough money to build!");
		return;
	}

	console.log('valid');
	
	// calling the function that adds a building to the list
	let tx = await contract.addBuilding(
		req.params.id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.orientation,
		building.level,
		building.type,
		{ gasLimit:5e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	);
	console.log(tx);
	let receipt;
	try {
		receipt = await tx.wait();
		console.log(receipt);
	}
	catch(e) {
		console.log(e);
	}

	// calling the function that changes the score
	cityData = await contract.getCityData(req.params.id);
	city = utils.formatBuildingList(cityData);
	let income = incomeModule.calculateIncome(city);
	
	console.log('INCOME:', income);
	let score = city.money + 7*income;
	console.log('NEW SCORE:', score);
	tx = await contract.changeScore(req.params.id, score, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
	
	// res.status(200).send('Success');
}); // DONE

app.post("/cities/:id/buildspecial", async (req, res) => {
	let building = req.body.building;
	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner; // this address could be also sent in the body of the request
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}

	// checking the format of the building
	if(utils.isSpecialBuildingFormat(building) == false) {
		res.status(400).send("Bad format!");
		return;
	}
	// checking if it overlaps with other buildings
	if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
		return;
	}

	// getting and formating the data about the special building type  
	let specialTypeData = await contract.getSpecialBuildingType(building.type);
	specialTypeData = {
		count: specialTypeData.count,
		numOfOffers: specialTypeData.numOfOffers,
		rarity: specialTypeData.rarity,
		soldOut: specialTypeData.soldOut,
		offers: specialTypeData.offers
	}
	specialTypeData.offers = specialTypeData.offers.map((element, index) => ({
		value: element.value.toNumber(),
		user: element.user.toNumber(),
		filled: element.filled,
		index: index
	}));

	// getting the cost of the building depending on if it is bought through an offer or not
	let cost;
	let cashIndex = 0;
	if(req.body.throughOffer === false) {
		// checking if it is not sold out
		if(specialTypeData.count === 0) {
			res.send(500).send("Special building is sold out");
			return;
		}
		console.log(buildingStats.specialPrices, building.type);
		cost = buildingStats.specialPrices.get(building.type);
	}
	else {
		cashIndex = city.specialBuildingCash.indexOf(building.type);
		let tempIndex = -1; // index of the highest offer the person made (because the biggest offer is always accepted)
		console.log(specialTypeData.offers);
		specialTypeData.offers.forEach((element, index) => {
			if(parseInt(element.user) === parseInt(req.params.id) && element.filled === true && (tempIndex === -1 || element.value > specialTypeData.offers[tempIndex].value) ) {
				console.log({element});
				tempIndex = index;
			}
		});
		if(tempIndex === -1) {
			console.log("The person did not make any offers for this special building type");
			res.status(400).send("The person did not make any offers for this special building type");
			return;
		}
		cost = specialTypeData.offers[tempIndex].value;
		console.log(cost);
	}

	if(cost >= city.money) {
		res.status(400).send("Not enough money to build!");
		return;
	}

	console.log({
		id: req.params.id,
		cost,
		startx: building.start.x,
		starty: building.start.y,
		endx: building.end.x,
		endy: building.end.y,
		orientation: building.orientation,
		type: building.type,
		throughOffer: req.body.throughOffer,
		cashIndex,
	})
	let tx = await contract.addSpecialBuilding(
		req.params.id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.orientation,
		building.type,
		req.body.throughOffer,
		cashIndex,
		// offerIndex,
		{ gasLimit: 2e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	);
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		console.log(e);
		res.status(500).send(e);
		return;
	}
}); // DONE

app.post("/cities/:id/upgrade", async (req, res) => {
	let building = req.body.building; // 'Building' object
	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}

	let cost = buildingStats.buildingStats.get(building.type)[building.level].cost; // getting the cost of upgrading to the next level
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}

	console.log({cost, city});
	if(city.money < cost) {
		res.status(400).send('Not enough money to perform upgrade');
		return;
	}

	if(utils.isBuildingFormat(building) /* && utils.isSameBuilding(building, city.buildings[index]) */ ) {
		let tx = await contract.upgradeBuilding(
			req.params.id,
			cost,
			building.id,
			{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
		);
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
			return;
		}

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData);
		let income = incomeModule.calculateIncome(city);
		console.log('income', income);
		console.log('score', city.money + 7*income);

		tx = await contract.changeScore(req.params.id, city.money + 7*income, { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
			return;
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
			return;
		}
	}
	else {
		res.status(400).send("Data sent is not correct");
		return;
	}
}); // DONE

app.post("/cities/:id/remove", async (req, res) => {
	let building = req.body.building; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner; // this address could be also sent in the body of the request
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		console.log('the caller of this function must be the owner of the NFT');
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return; 
	}
	
	let RETURN_PERCENTAGE = 0.5;
	let value = RETURN_PERCENTAGE * buildingStats.buildingStats
		.get(building.type) // dobija se lista levela i podataka o levelima
		.slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
		.reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		value *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}
	
	if(utils.isBuildingFormat(building)) {

		console.log({id: req.params.id, value});
		let tx = await contract.removeBuilding(
			req.params.id,
			value,
			building.id,
			{ maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
		);
		console.log({ tx });
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
			return;
		}

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData).buildings;
		console.log(city);

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData);
		let income = incomeModule.calculateIncome(city);

		tx = await contract.changeScore(req.params.id, city.money + 7*income, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
			return;
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
			return;
		}
	}
	else {
		console.log('data sent is not correct');
		res.status(400).send("Data sent is not correct");
	}
}); // DONE

app.post("/cities/:id/removespecial", async (req, res) => {
	let id = parseInt(req.params.id);

	let building = req.body.building;

	// treba da se napravi provera da li je postlati building isti kao sto je onaj u contractu
	const RETURN_PERCENTAGE = 0.25;
	let value = RETURN_PERCENTAGE * buildingStats.specialPrices.get(building.type); // treba da se uzme vrednost odgovarajuceg tipa gradjevina
	let buyerId = 0;
	let offerIndex = 0;
	
	if(req.body.throughOffer === false) {
		value = RETURN_PERCENTAGE * buildingStats.specialPrices.get(building.type); // treba da se uzme vrednost odgovarajuceg tipa gradjevina		
		console.log({value});
	}
	else {
		// getting the data about the special building type the person is trying to sell
		let specialTypeData = await contract.getSpecialBuildingType(building.type);
		specialTypeData = {
			count: specialTypeData.count,
			numOfOffers: specialTypeData.numOfOffers,
			rarity: specialTypeData.rarity,
			soldOut: specialTypeData.soldOut,
			offers: specialTypeData.offers
		}
		specialTypeData.offers = specialTypeData.offers.map((element, index) => ({
			value: element.value.toNumber(),
			user: element.user.toNumber(),
			filled: element.filled,
			index: index
		}));

		console.log(specialTypeData.offers);
		
		let offers = specialTypeData.offers.filter(element => element.user !== id && element.filled === false);
		console.log(offers);
		
		// checking if there are any offers
		if(offers.length === 0) { 
			res.status(400).send('There are no offers');
		}
		
		// finding the best offer
		offers.sort((a, b) => b.value - a.value); // mozda treba da se obrne operacija oduzimanja, ali trebalo bi da je dobro sad ovako
		value = offers[0].value;
		buyerId = offers[0].user;
		offerIndex = offers[0].index;

		console.log({
			value, buyerId, offerIndex
		})

		if(value < req.body.expectedValue) {
			res.status(500).send('action canceled, the target offer got already filled');
			return;
		}
	}

	let tx = await contract.removeSpecialBuilding(
		id,
		value,
		building.id,
		req.body.throughOffer,
		buyerId,
		offerIndex,
		{ gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 }
	);
	console.log(tx);
	try {
		let receipt = await tx.wait();
		console.log(receipt);

		if(value > req.body.expectedValue) {
			res.status(200).send('sold at higher value');
		}
		else {
			res.status(200).send('success');
		}
		return;
	}
	catch(e) {
		res.status(400).send('error in the smart contract function call');
		return;
	}
}); // DONE

app.post("/cities/:id/rotate", async (req, res) => {
	let data = req.body;

	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let building = city.buildings.reduce((prev, curr) => curr.id === id ? curr : prev, -1);

	if(building === -1) {
		res.status(400).send("Building with the id that was sent does not exist");
		return;
	}
	
	// ako je gradjevina nesimetricna onda moze da se rotira samo za 180 stepeni
	if(building.end.x - building.start.x !== building.end.x - building.start.x) {
		if((building.rotation - rotation + 100) % 2 === 1) {
			res.status(400).send("Can't rotate building this way");
			return;
		}
	}

	let tx = await contract.rotate(req.params.id, data.id, data.rotation, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		res.status(400).send(e);
		return;
	}
}); // ADD CHECKS FOR THE REQUEST

app.post("/cities/:id/rotatespecial", async (req, res) => {
	let data = req.body;
	
	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let building = city.specialBuildings.reduce((prev, curr) => curr.id === id ? curr : prev, -1);

	if(building === -1) {
		res.status(400).send("Building with the id that was sent does not exist");
		return;
	}
	
	// ako je gradjevina nesimetricna onda moze da se rotira samo za 180 stepeni
	if(building.end.x - building.start.x !== building.end.x - building.start.x) {
		if((building.rotation - rotation + 100) % 2 === 1) {
			res.status(400).send("Can't rotate building this way");
			return;
		}
	}

	let tx = await contract.rotateSpecial(req.params.id, data.id, data.rotation, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		res.status(400).send(e);
		return;
	}
}); // ADD CHECKS FOR THE REQUEST

// #endregion



// #region Dev options:
	app.post("/cities/:id/dev/setmoney", async (req, res) => {
	let tx = await contract.devSetMoney(req.params.id, req.body.money, { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		// res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}

	let cityData = await contract.getCityData(req.params.id);
	city = utils.formatBuildingList(cityData);
	let income = incomeModule.calculateIncome(city);

	tx = await contract.changeScore(req.params.id, city.money + 7*income, { maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	try {
		receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
});

app.post("/cities/:id/dev/demolish", async (req, res) => {
	let tx = await contract.devDemolishCity(req.params.id, { gasLimit: 1e6, maxPriorityFeePerGas: 50e9, maxFeePerGas: (50e9)+16 });
	
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
});
// #endregion

// #region Achievements

app.get("/cities/:id/achievements", async (req, res) => {
	let keyList = Object.keys(achievements.achievements);
	let dataList = [];

	const loadAchievementData = async (key) => {
		let count = await achievementContract.getAchievementCount(key);
		let completed = await achievementContract.checkIfCompleted(req.params.id, key);
		dataList.push({
			key: key,
			count: count,
			completed: completed
		})
	}

	const delay = async (time) => {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	for(let i = 0; i < keyList.length; i++) {
		loadAchievementData(keyList[i]);
	}

	while(dataList.length < keyList.length) {
		await delay(50);
	}

	res.send(dataList);
});

app.post('/cities/:id/completed', async (req, res) => {
	let city = await getFunctions.getCityData(req.params.id, contract, achievementContract);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.cityOwner;
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		console.log('The caller of this function must be the owner of the NFT');
		console.log('The real owner is ', signer);
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}
	
	let achievement = achievements.achievements[req.body.achievement];
	let active = achievements.checkIfActive(achievement);
	if(active === false) {
		console.log("Can't complete an achievement if it is not active!");
		res.status(400).send("Can't complete an achievement if it is not active!");
		return;
	}

	let completed = await achievement.check();

	if(completed === false) {
		console.log("Achievement is not completed!");
		res.status(400).send("Achievement is not completed!");
		return;
	}

	let count = achievementContract.getAchievementCount(req.body.achievement);
	let numOfNfts = await contract.getNumOfPlayers();
	numOfNfts = parseInt(numOfNfts._hex, 16);
	if(count === achievement.percentage * numOfNfts) {
		console.log("Max number of people completed the achievement!");
		res.status(400).send("Max number of people completed the achievement!");
		return;
	}
	
	let tx = await achievementContract.completedAchievement(req.params.id, req.body.achievement);
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(500).send("Transaction failed");
		return;
	}

	// changing the score... (optional)

});

// #endregion

app.listen(port, () => console.log(`Example app listening on port ${port}!`));