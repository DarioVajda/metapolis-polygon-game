const express = require("express");

const buildingsModule = require('../gameplay/building');
const mapModule = require('../gameplay/map');
const moneyModule = require('../gameplay/money');
const utils = require('./utils');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/buildings", (_,res) => {
	res.json(buildingsModule.getBuildings());
});

app.get("/money", (_,res) => {
	res.json({value: moneyModule.getMoneyValue()});
});

app.post("/buildings/build", (req, res) => {
	if(utils.isBuildingFormat(req.body) === false) {
		res.status(400).send("The JSON data has a wrong format");
		return;
	}
	if(utils.doesOverlap(req.body, mapModule.initializeMap(buildingsModule.getBuildings(), mapModule.mapDimensions))) {
		res.status(400).send("The building overlaps with something that already exists!");
		return;
	}
	let cost = req.body.type.cost;

	let enoughMoney = moneyModule.changeMoneyValue(-cost);
	if(enoughMoney) {
		let newBuilding = JSON.parse(JSON.stringify(req.body));
		console.log(newBuilding);
		buildingsModule.addBuilding(newBuilding);
		console.log('Successfully built'); // obrisati kasnije
		res.status(200).send("Successfully built.");
	}
	else {
		console.log("You don't have enough money to build"); // obrisati kasnije
		res.status(400).send("You don't have enough money");
	}
});

app.post("/buildings/upgrade", (req, res) => {
	if(req.body.index === undefined) {
		res.status(400).send("The JSON data has a wrong format (no field with name 'index'!)");
		return;
	}
	let cost = buildingsModule.upgradeBuilding(req.body.index, false);
	if(cost === -1) {
		res.status(400).send('The recieved index is invalid (out of bounds)!');
		return;
	}
	let enoughMoney = moneyModule.changeMoneyValue(-cost);

	if(enoughMoney) {
		if(cost === 0) {
			res.status(400).send('Unsuccessfull upgrade, the building is already at max level!');
		}
		else {
			buildingsModule.upgradeBuilding(req.body.index, true);
			res.status(200).send('Successfully upgraded the building.');
		}
	}
	else {
		res.status(400).send("You don't have enough money to perform this upgrade!");
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));