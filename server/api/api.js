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
}); // poziva funkciju iz building.js fajla

app.get("/money", (_,res) => {
	res.json({value: moneyModule.getMoneyValue()});
}); // poziva funkciju iz money.js fajla

app.post("/buildings/build", (req, res) => {
	if(utils.isBuildingFormat(req.body) === false) {
		res.status(400).send("The JSON data has a wrong format");
		return;
	} // ako je format fajla los, vraca se greska
	if(req.body.level !== 0) {
		res.status(400).send("You can't build something that is not at the level 0");
		return;
	} // ako je level gradjevine koja zeli da se izgradi razlicit od 0 onda se vraca greska jer to nije moguce
	if(utils.doesOverlap(req.body, mapModule.initializeMap(buildingsModule.getBuildings(), mapModule.mapDimensions))) {
		res.status(400).send("The building overlaps with something that already exists!");
		return;
	} // ako se zeljena gradjevina preklapa sa necim sto vec postoji onda se vraca greska
	
	let cost = buildingsModule.buildingStats.get(req.body.type)[0].cost;
		// dobija se cena gradjevine iz mape buildingStats

	let enoughMoney = moneyModule.changeMoneyValue(-cost);
		 // ako ima dovoljno novca platice se i dobice se true 
		// a u suptrotnom se vraca false i kolicina novca se nije smanjila

	if(enoughMoney) {
		let newBuilding = JSON.parse(JSON.stringify(req.body)); // pravi se novi objekat sa istim osobinama kao primljeni JSON
		buildingsModule.addBuilding(newBuilding); // dodaje se gradjevina na listu
		res.status(200).send("Successfully built."); // poruka sa statusom 200
	}
	else {
		res.status(400).send("You don't have enough money"); // poruka greske sa statusom 400
	}
}); // ukoliko je sve u redu izgradice se zgrada, a ako nije onda ce se vratiti greska

app.post("/buildings/upgrade", (req, res) => {
	if(req.body.index === undefined || Object.values(req.body).length !== 1) {
		res.status(400).send("The JSON data has a wrong format (no field with name 'index' or other extra fields!)");
		return;
	} // ako ne postoji polje index ili ima polja viska onda se vraca greska
	let cost = buildingsModule.upgradeBuilding(req.body.index, false);
		// poziva se funkcija upgradeBuilding sa argumentom false sto znaci 
		// da se nece nista izgraditi samo ce se dobiti cena tog upgrade-a
	if(cost === -1) {
		res.status(400).send('The recieved index is invalid (out of bounds)!');
		return;
	} // ako se vrati cena -1 onda je indeks gradjevine netacan i vraca se greska

	let enoughMoney = moneyModule.changeMoneyValue(-cost);
		// proverava se da li igrac ima dovoljno novca i ako ima onda se oduzima ta kolicina

	if(enoughMoney) {
		if(cost === 0) {
			res.status(200).send('Unsuccessfull upgrade, the building is already at max level!');
		} // cost ce imati vrednost 0 ako je gradjevina vec na maks levelu
		else {
			buildingsModule.upgradeBuilding(req.body.index, true);
			res.status(200).send('Successfully upgraded the building.');
		} // poziva se funkcija upgradeBuilding sa argumentom true sto znaci 
		// da ce se upgradeovati gradjevina jer sad sigurno znamo da je moguce
	}
	else {
		res.status(200).send("You don't have enough money to perform this upgrade!");
	} // vraca se poruka da korisnik nema dovoljnu kolicinu novca
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 
	// pokrece se server