const express = require("express");
const ethers = require("ethers");
const fs = require("fs");

const buildingStats = require('../gameplay/building_stats');
const mapModule = require('../gameplay/map');
const peopleModule = require('../gameplay/people');
const incomeModule = require('../gameplay/income');
const generateModule = require('../rand_map/generate');
const utils = require('./utils');

const addressJSON = require('../../smart_contracts/contract-address.json');

// sifra za skolski metamast wallet: nftigrica
// WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.
// patient pudding valid edit budget equal west pole canyon quality cannon toilet

//#region connecting to the blockchain
const provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
console.log(wallet);
const contractAddress = addressJSON.gameplay;
console.log(contractAddress)
const abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var account = wallet.connect(provider);
var contract = new ethers.Contract(
	contractAddress,
	abi,
	account
);
//#endregion

const app = express();
const port = 8000;

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions))

app.get("/cities/:id", (req, res) => {
	res.json({
		name: `City #${req.params.id}`,
        description: "This is an image of a city that it's owners built",
        image: `http://localhost:3000/cities/${req.params.id}/image.jpg`, // this is going to be a different url
        external_url: `https://docs.openzeppelin.com/contracts/4.x/erc721` // this is going to be something else
    });
}); // DONE (for now)

app.get("/cities/:id/image.jpg", (req, res) => {
	console.log(`/cities/${req.params.id}/city-image.jpg`);
	res.sendFile('C:/Users/Dario Vajda/OneDrive/Desktop/nft project/nft/server/blockchain_api/temp_folder/city.jpg');
}); // DONE (for now)

app.get("/leaderboard", async (req, res) => {
	let leaderboard = [];
	let tree = await contract.getTree();
	if(tree.length === 0) {
		res.send([]);
		return;
	}
	// console.log('tree:', tree.map(element => element.id.toNumber()));
	// console.log('tree:', tree.map(element => {return { 
	// 	id____: element.id.toNumber(),
	// 	value_: element.value.toNumber(), 
	// 	left__: element.left.toNumber(), 
	// 	right_: element.right.toNumber(), 
	// 	height: element.height.toNumber()
	// }} ));
	const inorder = (root) => {
		console.log(root);
		if(tree[root].left && tree[root].left != 10000) {
			inorder(tree[root].left);
		}
		leaderboard.unshift(tree[root].id.toNumber()); // should insert in the front of the array to have it be sorted in a descending order!
		if(tree[root].right && tree[root].right != 10000) {
			inorder(tree[root].right);
		}
	}
	let root = 0;
	for(let i = 0; i < tree.length; i++) {
		if(tree[i].height > tree[root].height) root = i;
	}
	console.log('starting root: ', root);
	inorder(root);
	console.log('leaderboard:', leaderboard);
	res.send(leaderboard);
});

app.get("/cities/:id/data", async (req,res) => {
	/* The response is an object with the following values: 
	{
        address owner,
        Building[] buildings,
		SpecialBuilding[] specialBuildings,
        uint money,
        uint income,
        uint lastPay,
    }
	*/
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);
	// console.log(city);
	res.json(city);
}); // DONE - have to add the orientation to the smart contract

app.post("/cities/:id/initialize", async (req, res) => {
	if(req.body.address === undefined) {
		res.status(400).send("Problem with the request");
		return;
	}

	if(req.params.id < 0) {
		res.status(400).send("Index is smaller than 0");
		return;
	}

	let cityData = await contract.getCityData(req.params.id);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		console.log('The caller of this function must be the owner of the NFT');
		console.log('The real owner is ', signer);
		return res.status(400).send("The caller of this function must be the owner of the NFT");
	}
	console.log('Signature is correct');

	let buildings = generateModule.generateBuildings();
	let owner = req.body.address;
	let tokenId = req.params.id;
	let numOfBuildings = buildings.normal.length;
	let numOfSpecialBuildings = buildings.special.length;
	let startx = [];
	let starty = [];
	let endx = [];
	let endy = [];
	let buildingType = [];
	let specialType = [];
	let income;

	for(let i = 0; i < numOfBuildings; i++) {
		startx.push(buildings.normal[i].start.x);
		starty.push(buildings.normal[i].start.y);
		endx.push(buildings.normal[i].end.x);
		endy.push(buildings.normal[i].end.y);
		buildingType.push(buildings.normal[i].type);
	}
	for(let i = 0; i < numOfSpecialBuildings; i++) {
		startx.push(buildings.special[i].start.x);
		starty.push(buildings.special[i].start.y);
		endx.push(buildings.special[i].end.x);
		endy.push(buildings.special[i].end.y);
		specialType.push(buildings.special[i].type);
	}

	let map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
	let people = peopleModule.countPeople(buildings, map);
	income = incomeModule.calculateIncome(people, buildings);

	let tx = await contract.initializeCity(
		owner,
		tokenId,
		numOfBuildings,
		numOfSpecialBuildings,
		startx,
		starty,
		endx,
		endy,
		buildingType,
		specialType,
		income,
		{
			gasLimit: 1e7
		}
	);
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
	}
}); // DONE

app.post("/cities/:id/build", async (req, res) => {
	let building = req.body.building;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
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
	
	// calling the function that adds a building to the list
	let tx = await contract.addBuilding(
		req.params.id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.type,
		{gasLimit:5e6}
	);
	let receipt;
	try {
		receipt = await tx.wait();
		console.log(receipt);
	}
	catch(e) {
		console.log(e);
	}

	// calling the function that changes the income
	let income;
	let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
	let people = peopleModule.countPeople({normal: city.buildings} , map);
	income = incomeModule.calculateIncome(people, {normal: city.buildings} );
	
	console.log('INCOME:', income);
	tx = await contract.changeIncome(req.params.id, income);
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
}); // DONE (not tested yet)

app.post("/cities/:id/buildspecial", async (req, res) => {
	let building = req.body;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		return res.status(400).send("The caller of this function must be the owner of the NFT");
	}

	let cost = buildingStats.specialPrices[building.type];

	if(utils.isSpecialBuildingFormat(building) == false) {
		return res.status(400).send("Bad format!");
	}
	if(utils.doesOverlap(building, city)) {
		return res.status(400).send("Building overlaps!");
	}
	if(cost >= city.money) {
		return res.status(400).send("Not enough money to build!");
	}

	let tx = await contract.addSpecialBuilding(
		req.params.id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.type
	);
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
	}
	
	res.status(200).send(receipt);
}); // DONE (not tested yet)

app.post("/cities/:id/upgrade", async (req, res) => {
	let index = req.body.index; // integer
	let building = req.body.building; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(city[index] === undefined) {
		return res.status(400).send("Ivalid index")
	}

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		return res.status(400).send("The caller of this function must be the owner of the NFT");
	}

	let cost = buildingStats.buildingStats.get(building.type)[building.level].cost; // getting the cost of upgrading to the next level
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}

	if(utils.isSameBuilding(building, city[index]) && utils.isBuildingFormat(building)) {
		let tx = await contract.upgradeBuilding(
			req.params.id,
			cost,
			index
		);
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
		}

		let income;
		let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city.buildings} , map);
		
		income = incomeModule.calculateIncome(people, {normal: city.buildings} );
		tx = await contract.changeIncome(req.params.id, income);
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
		}
		

		res.status(200).send(receipt);
	}
	else {
		res.status(400).send("Data sent is not correct");
	}
}); // DONE (not tested yet)

app.post("/cities/:id/remove", async (req, res) => {
	let index = req.body.index; // integer
	let building = req.body.building; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(city[index] === undefined) {
		return res.status(400).send("Ivalid index")
	}

	let message = req.body.message;
	let signature = req.body.signature;
	let signer = cityData.owner; // this address could be also sent in the body of the request
	let signerAddr = await ethers.utils.verifyMessage(message, signature);
	if(signerAddr !== signer) {
		return res.status(400).send("The caller of this function must be the owner of the NFT");
	}

	let returnPercentage = 0.5;
	let value = returnPercentage * buildingStats.buildingStats.get(building.type)[building.level].cost;

	if(utils.isSameBuilding(building, city[index]) && utils.isBuildingFormat(building)) {
		let tx = await contract.removeBuilding(
			req.params.id,
			value,
			index
		);
		let receipt;
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
		}

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData).buildings;
		console.log(city);

		let income;
		let map = mapModule.initializeMap({normal: city} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city} , map);
		income = incomeModule.calculateIncome(people, {normal: city} );
		
		tx = await contract.changeIncome(req.params.id, income);
		try {
			receipt = await tx.wait();
			console.log(receipt);
			res.status(200).send(receipt);
		}
		catch(e) {
			console.log(e);
			res.status(400).send(e);
		}
	}
	else {
		res.status(400).send("Data sent is not correct");
	}
}); // DONE (not tested yet)

app.post("cities/:id/removespecial", async (req, res) => {
	let id = req.params.id;
	let index = req.body.index;

	let building = req.body.building;
 
	// treba da se napravi provera da li je postlati building isti kao sto je onaj u contractu

	let returnPercentage = 0.25;
	let value = returnPercentage * buildingStats.specialPrices.get(building.specialType); // treba da se uzme vrednost odgovarajuceg tipa gradjevina

	let tx = await contract.removeSpecialBuilding(id, value, index);
	try {
		let receipt = await tx.wait();
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		res.status(400).send('error in the smart contract function call');
		return;
	}
}); // work in progress

app.post("/cities/:id/getincome", async (req, res) => {
	// here could be some kind of a check if the player can receive income...
	let tx = await contract.getIncome(req.params.id, {gasLimit: 1e6});
	
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		console.log('Income received!');
		res.status(200).send(receipt);
		return;
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}
}); // DONE

app.listen(port, () => console.log(`Example app listening on port ${port}!`));