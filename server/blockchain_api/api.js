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
	// const mnemonic = 'view protect chapter volcano vote news humble history village wire sunny cheese';
	const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
	console.log(wallet);
	const contractAddress = '0xb3972B3da57728f41EF0Cc4b2a6b8810A650c190';
	const abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/CityContract.json").toString().trim()).abi;
var account = wallet.connect(provider);
var contract = new ethers.Contract(
	contractAddress,
	abi,
	account
	);

async function main() {
	var tx;
	var reciept;
	// tx = await contract.withdraw({gasLimit: 1e5});
	// reciept = await tx.wait();
	// console.log('Withdrawn! ', reciept);
	// tx = await contract.safeMint(1, {value: ethers.utils.parseEther('0.1'), gasLimit: 1e7});
	// reciept = await tx.wait();
	// console.log('Reciept 2: ', reciept);
	// let currId = await contract.currId();
	// tx = await contract.initializeCity(wallet.address, currId-1, 2, 0, [3, 4], [3, 4], [3, 4], [3, 4], ['house', 'house'], [], 10000, {gasLimit: 1e7});
	// reciept = await tx.wait();
	// console.log('Reciept 3: ', reciept);
}
// main();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/cities/mint", async (req, res) => {
	var tx;
	var recipet;

	tx = await contract.safeMint(1, {value: ethers.utils.parseEther('0.1'), gasLimit: 1e7}); // this is later going to be done in the frontend
	reciept = await tx.wait();
	console.log(reciept);
	let randBuildings = generateModule.generateBuildings();
	let startx = [];
	let starty = [];
	let endx = [];
	let endy = [];
	let types = [];
	let specialTypes = [];
	randBuildings.forEach((element) => {
		startx.push(element.start.x);
		starty.push(element.start.y);
		endx.push(element.end.x);
		endy.push(element.end.y);
		types.push(element.type);
	});
	let buildings = buildingsModule.getBuildings();
    let map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
    let people = peopleModule.countPeople(buildings, map);
    let income = incomeModule.calculateIncome(people, buildings);
	let currId = await contract.currId();
	tx = await contract.initializeCity(wallet.address, currId-1, randBuildings.length, 0, startx, starty, endx, endy, types, specialTypes, income);
	reciept = await tx.wait();
	console.log(reciept);
	res.json(200);
});

app.get("/cities/:id/cityimage", (req, res) => {
	// access the sent id with req.params.id
	// let x = Number(req.params.id);
	console.log(`/cities/${req.params.id}/cityimage`)
	res.sendFile('C:/Users/Dario Vajda/OneDrive/Desktop/nft project/nft/server/blockchain_api/temp_folder/city.jpg');
});

app.get("/cities/:id/buildings", (req,res) => {

});

app.get("/cities/:id/money", (req,res) => {
	
});

app.post("/cities/:id/buildings/build", (req, res) => {
	
});

app.post("/cities/:id/buildings/upgrade", (req, res) => {
	
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));