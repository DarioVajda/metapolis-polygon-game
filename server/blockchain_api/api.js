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

// TODO:
// trebam da napravim funkciju u smart contractu koja menja vreme koje je potrebno da se dobije plata u igrici

app.get("/cities/mint", async (req, res) => {
	
});

app.get("/cities/:id/cityimage", (req, res) => {
	// access the sent id with req.params.id
	// let x = Number(req.params.id);
	console.log(`/cities/${req.params.id}/cityimage`)
	res.sendFile('C:/Users/Dario Vajda/OneDrive/Desktop/nft project/nft/server/blockchain_api/temp_folder/city.jpg');
});

// the following function returns all the data about the city with the given ID
app.get("/cities/:id", async (req,res) => {
	/* The response is an array with the following values
	[
        address owner,
        uint numOfBuildings,
        uint numOfSpecialBuildings,
        uint[] startx,
        uint[] starty,
        uint[] endx,
        uint[] endy,
        string[] buildingType,
        uint[] specialType,
        uint money,
        uint income,
        uint lastPay,
    ]
	*/
	let city = await contract.getBuildings(req.params.id);
	console.log(city);
	res.json(city);
});

app.get("/cities/:id/money", (req,res) => {
	// ova funkcija za api je mozda visak
});

app.post("/cities/:id/build", (req, res) => {
	
});

app.post("/cities/:id/upgrade", (req, res) => {
	
});

// the method should be post!!!
app.get("/cities/:id/getincome", async (req, res) => {
	// here could be some kind of a check if the player can receive income...
	let tx = await contract.getIncome(req.params.id);
	let reciept = await tx.wait();
	console.log(reciept);
	console.log('Income received!');
	res.json('OK');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));