let express = require("express");
let ethers = require("ethers");
let fs = require("fs");

let buildingStats = require('../gameplay/building_stats');
let mapModule = require('../gameplay/map');
let peopleModule = require('../gameplay/people');
let incomeModule = require('../gameplay/income');
let generateModule = require('../rand_map/generate');
let utils = require('./utils');

let addressJSON = require('../../smart_contracts/contract-address.json');

// #region Contract
// connecting to the blockchain and other initializations
let provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
let wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
console.log(wallet);
let contractAddress = addressJSON.gameplay;
console.log(contractAddress)
let abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var account = wallet.connect(provider);
var contract = new ethers.Contract(
	contractAddress,
	abi,
	account
);

let app = express();
let port = 8000;

let cors=require("cors");
let corsOptions ={
	origin:'*', 
	credentials:true,
	optionSuccessStatus:200,
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions))

//#endregion
// #region Plan

//_______________________________________________________________________________________________
/* Planirane promene na backendu:

- INSTRUCTION LIST ENDPOINT
	- treba da se napravi endpoint koji prima listu instrukcija koje su se izvrsile nad nftom
	- treba samo jednom da se proveri signer i kasnije da se pozivaju funkcije redom kojim su poslate
	- pojedinacne funkcije koje bi se pozivale bi bile prakticno iste kao svi POST endpointobi trenutno (samo moze par provera da se izostavi da ne bi bilo ponavljanja)
	- slala bi se lista ovakvih objekata: { function: "string koji oznacava funkciju", args: { objekat koji sadrzi podatke koji se sad salju u telu requesta} }
	- ...

- initialize:
	- napraviti na serveru da se grad inicijalizuje tako sto se dodaju jedna po jedna gradjevina po ceni 0 i kasnije se pozove funkcija za inicijalizaciju grada na blockchain-u (to u stvari samo oznaci da je grad inicijalizovan i da je zapoceta igra sa tim gradom)

✓ leaderboard:
	- na blockchainu se cuva samo lista sa score-ovima igraca
	- ucitava se broj igraca (treba dodati to na Gameplay contract ako jos ne postoji) i svacij score jedan po jedan
	- imacemo niz objekata {id, score} i bice sortiran na serveru i poslat korisniku (to moze i u frontendu da se uradi, mada mislim da je ovako bolje)
	- potrebni dodaci:
		✓ smart contract - getScore(id), getNumOfPlayers()
		✓ server - popraviti endpoint '/leaderboard'

✓ income:
	- zarada se sama po sebi vise ne cuva nigde (po potrebi se racuna na serveru), MOZDA BI IPAK MOGLO DA SE CUVA ISTO KAO RANIJE
	- na blockchainu se cuva 'score' svakog igraca
	- na blockchainu se cuva takodje KOLIKO PUTA JE PRIMLJENA ZARADA, a na osnovu gameStart-a se odredjuje koliko puta je trebalo da bude primljena i toliko se dodaje
	- potrebni dodaci:
		✓ smart contract - setScore(id, _score)
		✓ server - popraviti endpoint '/getincome' 

✓ building orientation:
	- treba napraviti da se u contractu cuva orjentacija gradjevina
	- dodati da se to ucitava sa contract-a umesto da se uvek vraca 1 na serveru
	- obratiti paznju na to da se ne pokvari nesto u drugim funkcijama kad se ovo doda u contract... (brisanje, dodavanje, upgradeovanje,...)
	- potrebni dodaci: 
		✓ smart contract - 'orientation' polje u strukturama Building i SpecialBuilding, rotateBuilding(id, index, _rotation), rotateSpecialBuilding(id, index, _rotation)
		✓ server - treba u utils funkcijama da se doda deo koji vraca podatke sa servera umesto 1, endpoint /rotate

- optimizacije:
	- treba namestiti tipove podataka u 'City', 'Building' i 'SpecialBuilding' strukturama tako da se uklope u manje 'bajtova' (ne bas bajtovi nego reci od 256 bitova)
	- proveriti da li sve radi kad ima velik broj gradjevina u jednom gradu ili velik broj gradova u igrici, ako se pojavljuje problem onda ga popraviti nekako
	- izbegavati vracanje/slanje velikih nizova na contract

✓ dev options:
	✓ skloniti 'require(msg.sender === cities[id].owner);' jer msg.sender nece biti igrac nego server
	✓ napraviti endpointove za to privremeno
*/
//_______________________________________________________________________________________________

// #endregion
// #region NFT GET requests

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

// #endregion
// #region GET requests

app.get("/leaderboard", async (req, res) => {
	let numOfPlayers = await contract.getNumOfPlayers();
	if(numOfPlayers === 0) {
		res.send([]);
		return;
	}

	// getScore treba da vrati (score, initialized) !!!!!!!!!!!!!!!!!!!!!!!!
	let temp; // objekat koji ce imati polja id i score kad se dobiju podaci sa contracta
	let leaderboard = [];
	for(let i = 0; i < numOfPlayers; i++) {
		temp = await contract.getScore(i);
		if(temp.initialized) {
			leaderboard.push({ id: i, score: temp.score.toNumber() });
		}
	}

	console.log('leaderboard (not sorted):', leaderboard);
	leaderboard.sort((a, b) => b.score - a.score);
	console.log('leaderboard (sorted):', leaderboard);

	res.send(leaderboard);
});

app.get("/count", async (req, res) => {
	let count = await contract.getNumOfPlayers();
	count = parseInt(count.hex, 16);
	res.send({count: count});
});

app.get("/cities/:id/data", async (req, res) => {
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
	let score = await contract.getScore(req.params.id);
	city.score = score.score.toNumber();
	
	let income;
	let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
	let people = peopleModule.countPeople({normal: city.buildings} , map);
	income = incomeModule.calculateIncome(people, {normal: city.buildings} );
	city.income = income;
	// console.log(city);
	res.json(city);
}); // DONE - have to add the orientation to the smart contract

// #endregion
// #region POST requests

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
	let signer = cityData.owner;
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
	let tokenId = req.params.id;

	let tx = await contract.initializeCity(owner, tokenId); // initializing the money and incomesReceived 
	try {
		await tx.wait();
	}
	catch(e) {
		res.status(500).send(e);
		return;
	}
	console.log('initialize done');

	/*
	tx = await contract.changeusername(owner, 'username'); // initializing the username
	try {
		await tx.wait();
	}
	catch(e) {
		res.status(500).send(e);
		return;
	}
	*/

	// adding all the buildings (the 'price' for everything is 0)
	let element;
	for(let i = 0; i < buildings.normal.length; i++) {
		element = buildings.normal[i];
		console.log(element);
		tx = await contract.addBuilding(
			tokenId,
			0,
			element.start.x,
			element.start.y,
			element.end.x,
			element.end.y,
			element.orientation,
			element.type,
			{gasLimit: 1e6}
		);
		try {
			await tx.wait();
			console.log('success');
		}
			catch(e) {
			res.status(500).send(e); // ne znam sta znaci error code 500, ali treba mi onaj koji ukazuje na gresku u serveru
			return;
		}
	}
	for(let i = 0; i < buildings.special.length; i++) {
		element = buildings.special[i];
		console.log(element);
		console.log('nesto se desava');
		tx = await contract.addSpecialBuilding(
			tokenId,
			0, // cena
			element.start.x,
			element.start.y,
			element.end.x,
			element.end.y,
			element.orientation,
			'fountain',
			{gasLimit: 1e6}
		);
		try {
			await tx.wait();
			console.log('success');
		}
		catch(e) {
			res.status(500).send(e); // ne znam sta znaci error code 500, ali treba mi onaj koji ukazuje na gresku u serveru
			return;
		}
	}

	// inicijalizacija scora:
	cityData = await contract.getCityData(req.params.id);
	city = utils.formatBuildingList(cityData);
	console.log(city);
	let map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
	let people = peopleModule.countPeople(buildings, map);
	income = incomeModule.calculateIncome(people, buildings);

	tx = await contract.changeScore(req.params.id, city.money + 7*income);
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
		building.orientation,
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

	// calling the function that changes the score
	cityData = await contract.getCityData(req.params.id);
	city = utils.formatBuildingList(cityData);
	let income;
	let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
	let people = peopleModule.countPeople({normal: city.buildings} , map);
	income = incomeModule.calculateIncome(people, {normal: city.buildings} );
	
	console.log('INCOME:', income);
	let score = city.money + 7*income;
	console.log('NEW SCORE:', score);
	tx = await contract.changeScore(req.params.id, score);
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
		res.status(400).send("The caller of this function must be the owner of the NFT");
		return;
	}

	let cost = buildingStats.specialPrices[building.type];

	if(utils.isSpecialBuildingFormat(building) == false) {
		res.status(400).send("Bad format!");
		return;
	}
	if(utils.doesOverlap(building, city)) {
		res.status(400).send("Building overlaps!");
		return;
	}
	if(cost >= city.money) {
		res.status(400).send("Not enough money to build!");
		return;
	}

	let tx = await contract.addSpecialBuilding(
		req.params.id,
		cost,
		building.start.x,
		building.start.y,
		building.end.x,
		building.end.y,
		building.orientation,
		building.type
	);
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
}); // DONE (not tested yet)

app.post("/cities/:id/upgrade", async (req, res) => {
	let index = req.body.index; // integer
	let building = req.body.building; // 'Building' object
	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData).buildings;

	if(!city[index]) {
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

	if(utils.isBuildingFormat(building) && utils.isSameBuilding(building, city[index])) {
		let tx = await contract.upgradeBuilding(
			req.params.id,
			cost,
			index
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
		let income;
		let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city.buildings} , map);
		income = incomeModule.calculateIncome(people, {normal: city.buildings} );

		tx = await contract.changeScore(req.params.id, city.money + 7*income);
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

	// console.log(utils.isSameBuilding(building, city[index]))
	// console.log(utils.isBuildingFormat(building))
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
			return;
		}

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData).buildings;
		console.log(city);

		cityData = await contract.getCityData(req.params.id);
		city = utils.formatBuildingList(cityData);
		let income;
		let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
		let people = peopleModule.countPeople({normal: city.buildings} , map);
		income = incomeModule.calculateIncome(people, {normal: city.buildings} );

		tx = await contract.changeScore(req.params.id, city.money + 7*income);
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

app.post("/cities/:id/rotate", async (req, res) => {
	let data = req.body;
	
	// neke provere...

	let tx = await contract.rotate(req.params.id, data.index, data.rotation);
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
	
	// neke provere...

	let tx = await contract.rotateSpecial(req.params.id, data.index, data.rotation);
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

app.get("/cities/:id/getincome", async (req, res) => {
	// here could be some kind of a check if the player can receive income...

	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);

	let income;
	let map = mapModule.initializeMap({normal: city.buildings} , mapModule.mapDimensions);
	let people = peopleModule.countPeople({normal: city.buildings} , map);
	income = incomeModule.calculateIncome(people, {normal: city.buildings} );

	let tx = await contract.getIncome(req.params.id, income, {gasLimit: 1e6});
	
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

	tx = await contract.changeScore(req.params.id, city.money + 7*income);
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
// #region Dev options:
	app.post("cities/:id/dev/setmoney", async (req, res) => {
	let tx = await contract.devSetMoney(req.params.id, req.body.money, {gasLimit: 1e6});
	
	try {
		let receipt = await tx.wait();
		console.log(receipt);
		res.status(200).send(receipt);
	}
	catch(e) {
		console.log(e);
		res.status(400).send(e);
		return;
	}

	let cityData = await contract.getCityData(req.params.id);
	let city = utils.formatBuildingList(cityData);
	let map = mapModule.initializeMap(buildings, mapModule.mapDimensions);
	let people = peopleModule.countPeople(buildings, map);
	let income = incomeModule.calculateIncome(people, buildings);
	tx = await contract.changeScore(req.params.id, city.money + 7*income);
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

app.post("cities/:id/dev/demolish", async (req, res) => {
	let tx = await contract.devDemolishCity(req.params.id, {gasLimit: 1e6});
	
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));