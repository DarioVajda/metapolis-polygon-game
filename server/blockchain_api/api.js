const express = require("express");
const ethers = require("ethers");
const fs = require("fs");

const buildingStats = require('../gameplay/building_stats');
const mapModule = require('../gameplay/map');
const peopleModule = require('../gameplay/people');
const incomeModule = require('../gameplay/income');
const generateModule = require('../rand_map/generate');
const utils = require('./utils');

const provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
console.log(wallet);
const contractAddress = '0x0d1164dC6716bcE774e88520a61437f6bfd9DfB7';
const abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var account = wallet.connect(provider);
var contract = new ethers.Contract(
	contractAddress,
	abi,
	account
);

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/cities/:id/initialize", async (req, res) => {
	let buildings = generateModule.generateBuildings();
	if(req.body.address === undefined) {
		res.status(400).send("Problem with the request");
		return;
	}
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

	let map = mapModule.initializeMap(buildings.normal, mapModule.mapDimensions);
    let people = peopleModule.countPeople(buildings.normal, map);
    income = incomeModule.calculateIncome(people, buildings.normal);

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
		income
	);
	let receipt = await tx.wait();

	res.status(200).send(receipt);
}); // DONE

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

app.get("/cities/:id/data", async (req,res) => {
	/* The response is an object with the following values
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
}); // DONE

app.post("/cities/:id/build", async (req, res) => {
	let building = req.body;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);
	
	let cost = buildingStats.buildingStats.get(building.type)[0].cost;
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}
	
	if(utils.isBuildingFormat(building) === false) {
		res.status(400).send("Bad format!");
	}
	else if(building.level !== 0) {
		res.status(400).send("Building is not level 1!");
	}
	else if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
	}
	else if(cost >= city.money) {
		res.status(400).send("Not enough money to build!");
	}
	else {
		let tx = await contract.addBuilding(
			req.params.id,
			cost,
			building.start.x,
			building.start.y,
			building.end.x,
			building.end.y,
			building.type
		);
		let receipt = await tx.wait();
		
		res.status(200).send(receipt);
	}
}); // DONE

app.post("/cities/:id/buildspecial", async (req, res) => {
	let building = req.body;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	let cost = buildingStats.specialPrices[building.type];

	if(utils.isSpecialBuildingFormat(building) == false) {
		res.status(400).send("Bad format!");
	}
	else if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
	}
	else if(cost >= city.money) {
		res.status(400).send("Not enough money to build!");
	}
	else {
		let tx = await contract.addSpecialBuilding(
			req.params.id,
			cost,
			building.start.x,
			building.start.y,
			building.end.x,
			building.end.y,
			building.type
		);
		let receipt = await tx.wait();
		
		res.status(200).send(receipt);
	}
}); // DONE

app.post("/cities/:id/upgrade", async (req, res) => {
	let index = req.body.index; // integer
	let building = req.body.data; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	let cost = buildingStats.buildingStats.get(building.type)[building.level]; // getting the cost of upgrading to the next level
	if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
		cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
	}

	if(utils.isSameBuilding(building, city[index]) && utils.isBuildingFormat(building)) {
		let tx = await contract.upgradeBuiling(
			req.params.id,
			cost,
			index
		);
		let receipt = await tx.wait();

		res.status(200).send(receipt);
	}
	else {
		res.status(400).send("Data sent is not correct");
	}
}); // DONE

app.post("/cities/:id/getincome", async (req, res) => {
	// here could be some kind of a check if the player can receive income...
	let tx = await contract.getIncome(req.params.id);
	let receipt = await tx.wait();
	console.log('Income received!');
	res.send(receipt);
}); // DONE

// 10.2331

app.listen(port, () => console.log(`Example app listening on port ${port}!`));