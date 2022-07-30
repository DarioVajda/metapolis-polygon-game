let ethers = require("ethers");
let fs = require("fs");
let _ = require("lodash");

let buildingStats = require('../gameplay/building_stats');
let mapModule = require('../gameplay/map');
let peopleModule = require('../gameplay/people');
let incomeModule = require('../gameplay/income');
let utils = require('./utils');


/* FUNCTION RULES:

PARAMETERS:
===========
CHECK(
    city - same format as the 'formatBuildingList' functions return object
    offers - list of offers (formated like the list returned by the /specialtype/:type endpoint)
    args - the same as the body of the post request ( / {signature, message} )
)
    
PREVIEW(
    city - same format as the 'formatBuildingList' functions return object
    offers - list of offers (formated like the list returned by the /specialtype/:type endpoint)
    args - the same as the body of the post request ( / {signature, message} )
)

SAVE(
    contract - ethers.Contract (the Gameplay smart contract)
    args - the same as the body of the post request ( / {signature, message} )
)

RETURN:
=======
CHECK - Boolean
PREVIEW - Object {
    city: (formated as the 'formatBuildingList' functions return object)
    offers: ...
}
SAVE - ne znam jos...

* 'completed' functions will require some different arguments because of the Achievements smart contract

*/

const build = {
    Check: (id, city, specialTypeData, args) => {
        let { building } = args;
        
        // izvlaci se cena
        let cost = buildingStats.buildingStats.get(building.type)[0].cost;
        if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
            cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
        }
        
        // proverava se format argumenta
        if(utils.isBuildingFormat(building) === false) {
            return false;
        }
        // proverava se da li je level jednak 0
        if(building.level !== 0) {
            return false;
        }
        // proveravaju se preklapanja
        if(utils.doesOverlap(building, city)) {
            return false;
        }
        // provera se da li ima dovoljno novca
        if(cost > city.money) {
            return false;
        }

        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { building } = args;

        // na kraj liste gradjevina se dodaje poslata gradjevina
        city.buildings.push(building);
        
        // od kolicine novca se oduzima cena
        city.money -= buildingStats.buildingStats.get(building.type)[0].cost;

        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const buildspecial = {
    Check: (id, city, specialTypeData, args) => {
        let { building, throughOffer } = args;

        // proverava se format gradjevine
        if(utils.isSpecialBuildingFormat(building) === false) {
            res.status(400).send("Bad format!");
            return false;
        }
        // proverava se da li se gradjevina pleklapa sa nekom koja vec postoji
        if(utils.doesOverlap(building, city)) {
            return false;
        }
    
        // dobija se cena gradjevine u zavisnosti od toga da li je kupljeno kroz offer ili ne
        let cost;
        let cashIndex = 0;
        if(throughOffer === false) {
            // proverava se da li je gradjevina rasprodata
            if(specialTypeData[building.type].count === 0) {
                return false;
            }
            console.log(buildingStats.specialPrices, building.type);
            cost = buildingStats.specialPrices.get(building.type);
        }
        else {
            // proverava se da li postoji ovaj tip gradjevine u cash-u
            cashIndex = city.specialBuildingCash.indexOf(building.type);
            if(cashIndex === -1) {
                return false;
            }

            let tempIndex = -1; // index of the highest offer the person made (because the biggest offer is always accepted)
            console.log(specialTypeData[building.type]);
            specialTypeData[building.type].offers.forEach((element, index) => {
                if(parseInt(element.user) === parseInt(req.params.id) && element.filled === true && (tempIndex === -1 || element.value > specialTypeData[building.type].offers[tempIndex].value) ) {
                    console.log({element});
                    tempIndex = index;
                }
            });
            if(tempIndex === -1) {
                console.log("The person did not make any offers for this special building type");
                return false;
            }
            cost = specialTypeData[building.type].offers[tempIndex].value;
            console.log({cost});
        }
    
        if(cost >= city.money) {
            return false;
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { building, throughOffer } = args;

        // na kraj liste speciajlnih gradjevina se dodaje poslata specijalna gradjevina
        city.specialBuildings.push(building);

        // od kolicine novca se oduzima cena
        let cost;
        if(throughOffer === false) {
            cost = buildingStats.specialPrices.get(building.type);
        }
        else {
            // pronalazenje najveceg offera koji je osoba napravila
            let tempOffers = specialTypeData[building.type].offers.map((element, index) => ({ ...element, index }));
            let offer = tempOffers
                .filter(element => element.user === id)
                .reduce(
                    (max, curr) => {
                        if(max.value > curr.value) return max
                        else return {
                            value: curr.value,
                            index: curr.index
                        }
                    },
                    { value: 0, index: -1 }
                )

            cost = offer.value;

            // uklanjanje tipa specijalne gradjevine iz liste kupljenih
            let cashIndex = city.specialBuildingCash.indexOf(building.type);
            city.specialBuildingCash[cashIndex] = city.specialBuildingCash[city.specialBuildingCash.length - 1];
            city.specialBuildingCash.pop();

            // postavljanje 'filled' polja od offera na 'true'
            specialTypeData[building.type].offers[offer.index].filled = true;
        }
        city.money -= cost;


        return { city, offers };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const upgrade = {
    Check: (id, city, specialTypeData, args) => {
        let { index, building } = args;

        if(!city.buildings[index]) {
            return false;
        }

        let cost = buildingStats.buildingStats.get(building.type)[building.level].cost;
        if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
            cost *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
        }

        console.log({cost, city});
        if(city.money < cost) {
            return false;
        }

        if((utils.isBuildingFormat(building) && _.isEqual(building, city.buildings[index])) === false) {
            return false;
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { index, building } = args;
        
        // Povecavanje level-a
        let currLevel = city.buildings[index].level;
        city.buildings[index].level++;

        // Placanje upgrade-a
        city.money -= buildingStats.buildingStats.get(buildingStats)[currLevel].cost;
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const remove = {
    Check: (id, city, specialTypeData, args) => {
        let { index, building } = args;

        if(!city.buildings[index]) {
            return false;
        }

        if((utils.isBuildingFormat(building) && _.isEqual(building, city.buildings[index])) === false) {
            return false;
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { index, building } = args;
        let RETURN_PERCENTAGE = 0.5;

        // Uklanjanje gradjevine sa liste objekata
        city.buildings[index] = city.buildings[city.buildings.length - 1];
        city.buildings.pop();

        // Povracaj novca za uklonjenu gradjevinu
        let value = RETURN_PERCENTAGE * buildingStats.buildingStats
            .get(building.type) // dobija se lista levela i podataka o levelima
            .slice(0, building.level+1) // u obzir se uzimaju trenutni level i svi manji
            .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno

        if(building.type === buildingStats.buildingTypes.Building || building.type === buildingStats.buildingTypes.Park) {
            value *= (building.end.x - building.start.x + 1) * (building.end.y - building.start.y + 1);
        }

        city.money += value;
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const removespecial = {
    Check: (id, city, specialTypeData, args) => {
        let { building, index, throughOffer, expectedValue} = args;
    
        if(city.specialBuildings[index] === undefined) {
            return false;
        }

        if(utils.isSpecialBuildingFormat(building) == false && _.isEqual(building, city.specialBuildings[index])) {
            res.status(400).send("Bad format or not the same building!");
            return false;
        }

        if(throughOffer) {
            let offers = specialTypeData[building.type].offers.filter(element => element.user !== id && element.filled === false);
            if(offers.length === 0) {
                return false;
            }

            let maxOffer = offers.reduce((maxOffer, curr) => maxOffer>curr.value ? maxOffer : curr.value, 0);
            if(maxOffer < expectedValue) {
                return false;
            }
        }

        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { index, building, throughOffer, expectedValue } = args;
        let RETURN_PERCENTAGE = 0.25;

        // Uklanjanje specijalne gradjevine sa liste
        city.specialBuildings[index] = city.specialBuildings[city.specialBuildings.length - 1];
        city.specialBuildings.pop();
        
        // Povracaj novca za uklonjenu gradjevinu
        let value;
        if(throughOffer === false) {
            value = RETURN_PERCENTAGE * buildingStats.specialPrices.get(building.type);
        }
        else {
            let tempOffers = specialTypeData[building.type].offers.map((element, index) => ({ ...element, index }));
            let offer = tempOffers
                .filter(element => element.user !== id && element.filled === false)
                .reduce(
                    (max, curr) => {
                        if(max.value > curr.value) return max
                        else return {
                            value: curr.value,
                            index: curr.index
                        }
                    },
                    { value: 0, index: -1 }
                )
            
            value = offer.value;

            // uklanjanje ponude sa liste
            specialTypeData[building.type].offers[offer.index] = specialTypeData[building.type].offers[specialTypeData[building.type].offers.length - 1];
            specialTypeData[building.type].offers.pop();
        }
        city.money += value;

        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const rotate = {
    Check: (id, city, specialTypeData, args) => {
        let { index, building, rotation } = args;

        // proverava se da li je poslata gradjevina ista kao sto je na listi
        if(_.isEqual(building, city.buildings[index]) === false) {
            return false;
        }

        // ako je gradjevina nesimetricna onda moze da se rotira samo za 180 stepeni
        if(building.end.x - building.start.x !== building.end.x - building.start.x) {
            if((building.rotation - rotation + 100) % 2 === 1) {
                return false;
            }
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { rotation, index } = args;

        // menjanje rotacije za gradjevinu
        city.buildings[index].rotation = rotation;
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const rotateSpecial = {
    Check: (id, city, specialTypeData, args) => {
        let { index, building, rotation } = args;

        // proverava se dali je poslata gradjevina ista kao sto je na listi
        if(_.isEqual(building, city.specialBuildings[index]) === false) {
            return false;
        }

        // ako je gradjevina nesimetricna onda moze da se rotira samo za 180 stepeni
        if(building.end.x - building.start.x !== building.end.x - building.start.x) {
            if((building.rotation - rotation + 100) % 2 === 1) {
                return false;
            }
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { rotation, index } = args;

        // menjanje rotacije za gradjevinu
        city.specialBuildings[index].rotation = rotation;
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const specialoffer = {
    Check: (id, city, specialTypeData, args) => {
        let { value, type } = args;

        if(value > city.money) {
            return false;
        }
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        let { value, type } = args;

        // adding an offer to the list
        specialTypeData[type].offers.push({ user: id, value: value });
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

const completed = {
    Check: (id, city, specialTypeData, args) => {
        // proverava se ispravnost argumenta, njegov format itd
        // proverava se da li moze i sme da se izvrsi sledeca akcija
    
        return true;
    },
    Preview: (id, city, specialTypeData, args) => {
        // TODO - ovo sam ostavio za kasnije jer je bas mnogo posla (a i nije isplanirano skoro nista u vezi sa achievementovima za sad)
        
        return { city, specialTypeData };
    },
    Save: async (id, contract, args) => {
        // bez provera se poziva funkcija iz contracta i cuvaju se promene
    }
}

// #region functions

const functions = {
    build: {
        check: build.Check,
        preview: build.Preview,
        save: build.Save
    },
    buildspecial: {
        check: buildspecial.Check,
        preview: buildspecial.Preview,
        save: buildspecial.Save
    },
    upgrade: {
        check: upgrade.Check,
        preview: upgrade.Preview,
        save: upgrade.Save
    },
    remove: {
        check: remove.Check,
        preview: remove.Preview,
        save: remove.Save
    },
    removespecial: {
        check: removespecial.Check,
        preview: removespecial.Preview,
        save: removespecial.Save
    },
    rotate: {
        check: rotate.Check,
        preview: rotate.Preview,
        save: rotate.Save
    },
    rotateSpecial: {
        check: rotateSpecial.Check,
        preview: rotateSpecial.Preview,
        save: rotateSpecial.Save
    },
    specialoffer: {
        check: specialoffer.Check,
        preview: specialoffer.Preview,
        save: specialoffer.Save
    },
    completed: {
        check: completed.Check,
        preview: completed.Preview,
        save: completed.Save
    }
}

// #endregion

const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function instructionsApi(contract, achievementContract, id, instructions) {

    // #region TODO

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // BITNA IDEJA:
    // TREBA NAPRAVITI DA KAD SE BRISE/CANCELUJE VISE TOGA NA BLOCKCHAINU DA SE TO RADI REDOM, OD NAJVECEG DO NAJMANJEG INDEKSA, TREBA PREPRAVITI FUNKCIJE U CONTRACTU TAKO DA RADE TO SA NIZOM INDEKSA A NE SAMO SA JEDNIM!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // TODO - treba proveriti koji tipovi podataka trebaju da se ucitavaju (da se ne ucitava sve ako nije potrbno)
    // ...

    // #endregion

    let city; // objekat koji sadrzi podatke o gradu
    let specialTypeData; // objekat gde naziv polja predstavlja tip specijalnih gradjevina, a vrednost polja je objekat { count: }

    // #region ucitani svi podaci (osim za achievementove)

    // 1. Ucitavanje
    //   1.1 ucitavanje trenutnih podataka o gradu
    //   1.2 ucitavanje ponuda koje je napravio ovaj korisnik

    city = undefined;
    city = contract.getCityData(id); // treba promeniti ovo jer city nece biti undefined nego Promise i onda ce se proci while pre nego sto treba, treba napraviti funkciju koja ucita podatke i onda se tek da promenljivoj 'city'

    specialTypeData = {};
    const loadOffer = async (type) => {
        let data = await contract.getSpecialBuildingType(type);
        data = {
			count: data.count,
			numOfOffers: data.numOfOffers,
			rarity: data.rarity,
			soldOut: data.soldOut,
			offers: data.offers
		}
		data.offers = data.offers.map((element, index) => ({
			value: element.value.toNumber(),
			user: element.user.toNumber(),
			filled: element.filled,
			index: index
		}));
        specialTypeData[type] = data;
    }

    Object.values(buildingStats.specialTypes).forEach(element => {
        loadOffer(element.type);
    });

    // ceka se dok se ne ucitaju svi podaci koji su potrebni
    while(city === undefined || Object.keys(specialTypeData).length < Object.keys(buildingStats.specialTypes).length) {
        await delay(50);
    }

    // #endregion
    // #region podaci za achievementove

    // ...

    // #endregion

    // #region provere

    // 2. Provera (petlja koja prolazi kroz sve instrukcije jednu po jednu i radi sledece)
    //   2.1 provera trenutne instrukcije (Check)
    //      - false -> prekidanje funkcije
    //      - true -> nastavljanje
    //   2.2 menjanje trenutnih podataka (Preview)
    //      - menjanje lokalne kopije grada koja se cuva sa sledecu iteraciju kroz listu instrukcija

    let tempData;
    for(let i = 0; i < instructions.length; i++) {
        let element = instructions[i];

        if(Object.keys(functions).includes(element.instruction) === false) {
            return { 
                status: 400,
                message: `Instruction '${element.instruction}' does not exist!`,
                errors: []
            };
        }

        let check = await functions[element.instruction].check(id, city, specialTypeData, element.body);
        if(check === false) {
            return { 
                status: 400,
                message: `Transaction ${element.instruction} can not be performed!`,
                errors: []
            };
        }

        tempData = functions[element.instruction].preview(id, city, specialTypeData, element.body);
        city = tempData.city;
        specialTypeData = tempData.offers;
    }

    // #endregion

    // #region cuvanje promena

    // 3. Cuvanje promena:
    //   - treba odrediti neki redosled kojim ce se izvrsavati funkcije (npr build i remove moraju pre upgrade) ili...
    //   - IDEJA: napraviti nacin da se proveri da li se ista gradjevina izgradila i upgradeovala, ako jeste onda odmah kod dodavanja gradjevine u contract poslati novi level umesto da default postane 0
    //   - planiranje detalja ovoga ostavljam za kasnije...

    let upgrade = [];
    let completed = [];
    let rotate = [];

    let remove = [];
    let removespecial = [];
    
    let build = [];
    let offer = [];

    instructions.forEach(element => {
        let { instruction, body } = element;
        switch(instruction) {
            case 'upgrade': upgrade.push(element); break;

            case 'completed': completed.push(element); break;

            case 'rotate':
            case 'rotatespecial': rotate.push(element); break;

            case 'remove': remove.push(element); break;

            case 'removespecial': removespecial.push(element); break;

            case 'build':
            case 'buildspecial': build.push(element); break;

            case 'offer': offer.push(element); break;
        }
    });

    let orderedInstructions = [];
    orderedInstructions.push([ ...upgrade, ...completed, ...rotate ]);
    //                                                         // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    orderedInstructions.push([ ...remove, ...removespecial ]); // !!!!!!!!! OVO TREBA DA SE PROMENI I DA SE NAPRAVI FUNKCIJA KOJA RADI SA LISTOM INDEKSA !!!!!!!!!
    //                                                         // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    orderedInstructions.push([ ...build ]);
    orderedInstructions.push([ ...offer ]);

    let instructionCount; // number of instructions that are left to be executed in a batch
    let batchFailedCount; // number of transactions that failed 5 times in a row in a batch
    let failedCount = 0; // number of transactions that failed in total

    let errors = []; // list of transactions that failed [ { instruction: 'key', body: {...} }, ... ]

    const saveFunctionCall = async (id, instructions, index, number) => {
        let res = await functions[instructions[index].instruction].save(id, contract, instructions[index].body);

        if(false) { // ovde treba da bude neka provera za to da li je doslo do greske prilikom cuvanja podataka
            errors.push({ instruction: instructions[index].instruction, body: args });

            if(number < 5) {
                saveFunctionCall(id, instructions, index, number+1);
            }
            else {
                batchFailedCount++;
            }
        }

        instructionCount--;
    }

    for(let i = 0; i < orderedInstructions.length; i++){
        let list = orderedInstructions[i];

        instructionCount = list.length;
        batchFailedCount = 0;

        for(let i = 0; i < list.length; i++) {
            saveFunctionCall(id, list, i, 0);
        }

        while(instructionCount - batchFailedCount > 0) {
            await delay(50);
        }

        failedCount += batchFailedCount;

    }

    if(failedCount === 0) return {
        status: 200,
        message: 'success',
        errors: errors
    };
    else return {
        status: 500,
        message: `${failedCount} transactions could not be performed successfully`,
        errors: errors
    };

    // #endregion

}



exports.instructionsApi = instructionsApi;