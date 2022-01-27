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
	
}); // poziva funkciju iz building.js fajla

app.get("/money", (_,res) => {
	
}); // poziva funkciju iz money.js fajla

app.post("/buildings/build", (req, res) => {
	
});

app.post("/buildings/upgrade", (req, res) => {
	
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 
	// pokrece se server