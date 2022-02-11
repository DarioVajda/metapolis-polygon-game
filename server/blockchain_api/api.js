const express = require("express");
const ethers = require("ethers");
const fs = require("fs");

const buildingsModule = require('../gameplay/building');
const mapModule = require('../gameplay/map');
// const moneyModule = require('../gameplay/money');
const peopleModule = require('../gameplay/people');
const incomeModule = require('../gameplay/income');
const generateModule = require('../rand_map/generate');
const utils = require('./utils');

const provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
console.log(wallet);
const contractAddress = '0x5755c8Bdf367Cc4AE6AB3463289B6601842b654e';
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
	let buildings = generateModule.generateBuildings(); // this function should also be able to create a special building
	contract.initializeCity( buildings /* function arguments */ );
});

app.get("/cities/:id", (req, res) => {
    res.json({
        name: `City #${req.params.id}`,
        description: "This is an image of a city that it's owners built",
        image: `http://localhost:3000/cities/${req.params.id}/image.jpg`,
        external_url: `https://docs.openzeppelin.com/contracts/4.x/erc721` // this is going to be something else
    });
}); // DONE

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
	console.log(city);
	res.json(city);
}); // DONE

app.post("/cities/:id/build", (req, res) => {
	let building = req.body;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	if(utils.isBuildingFormat(building) === false) {
		res.status(400).send("Bad format!");
	}
	else if(building.level !== 0) {
		res.status(400).send("Building is not level 1!");
	}
	else if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
	}
	else {
		let tx = await contract.addBuilding(
			req.params.id,
			1000, // * this is the price of the building - might be removed and determined in the smart contract
			building.start.x,
			building.start.y,
			building.end.x,
			building.end.y,
			building.type
		);
		let reciept = await tx.wait();
		
		res.status(200).send(reciept);
	}
}); // DONE (*)

app.post("/cities/:id/buildspecial", async (req, res) => {
	let building = req.body;
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	if(utils.isSpecialBuildingFormat(building) == false) {
		res.status(400).send("Bad format!");
	}
	else if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
	}
	else {
		let tx = await contract.addSpecialBuilding(
			req.params.id,
			1000, // * this is the price of the building - might be removed and determined in the smart contract
			building.start.x,
			building.start.y,
			building.end.x,
			building.end.y,
			building.type
		);
		let reciept = await tx.wait();
		
		res.status(200).send(reciept);
	}
}); // DONE (*)

app.post("/cities/:id/upgrade", async (req, res) => {
	let index = req.body.index; // integer
	let building = req.body.data; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(utils.isSameBuilding(building, city[index]) && utils.isBuildingFormat(building)) {
		let tx = await contract.upgradeBuiling(
			req.params.id,
			10000, // * this is the price of upgrading - might be removed and determined in the smart contract
			index
		);
		let reciept = await tx.wait();

		res.status(200).send(reciept);
	}
	else {
		res.status(400).send("Data sent is not correct");
	}
}); // DONE (*)

app.post("/cities/:id/getincome", async (req, res) => {
	// here could be some kind of a check if the player can receive income...
	let tx = await contract.getIncome(req.params.id);
	let reciept = await tx.wait();
	console.log('Income received!');
	res.send(reciept);
}); // DONE

app.listen(port, () => console.log(`Example app listening on port ${port}!`));