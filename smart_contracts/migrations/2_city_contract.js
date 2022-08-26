const CityContract = artifacts.require("CityContract");
const Weth = artifacts.require("Weth");
const Gameplay = artifacts.require("Gameplay");
const Achievements = artifacts.require("Achievements");

module.exports = async function (deployer) {
    await deployer.deploy(Weth);
    let weth = await Weth.deployed();

    await deployer.deploy(CityContract, weth.address, '0x0715A7794a1dc8e42615F059dD6e406A6594651A', '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'); // adrese contractova koji vracaju cenu (valjda ima veze sa chainlink-om)
    let city = await CityContract.deployed();
    
    await deployer.deploy(Gameplay, '0x764cDA7eccc6a94C157742e369b3533D15d047c0', city.address); // adresa admina i adresa NFT contracta
    let gameplay = await Gameplay.deployed();

    await deployer.deploy(Achievements, '0x764cDA7eccc6a94C157742e369b3533D15d047c0', city.address); // adresa admina i adresa NFT contracta
    let achievements = await Achievements.deployed();

    // ovde mozda moze da se izvrsi nesto sa mintovanjem i inicializovanjem par NFTova da bi se ubrzalo testiranje...
};

// old initialize city function:
/*
    /**
     * @dev Function used for minting new City NFTs
     * @param tokenId index of the token being initialized
     * @param numOfBuildings number of buildings in the city
     * @param numOfSpecialBuildings number of special buildings in the city
     * @param startx arrays of coordinates for both types of buildings
     * @param starty ...
     * @param endx ...
     * @param endy ...
     * @param buildingType array of strings representing the buildingTypes
     * @param specialType uint array representing the types of the special buildings
     * @param income the calculated income for the city
     * /
     function initializeCity(
        address owner,
        uint tokenId,
        uint numOfBuildings,
        uint numOfSpecialBuildings,
        string calldata username,
        uint[] memory startx,
        uint[] memory starty,
        uint[] memory endx,
        uint[] memory endy,
        uint[] memory orientation,
        string[] memory buildingType,
        string[] memory specialType,
        uint income
    ) external onlyAdmin isEditable {
        require(cities[tokenId].created == true , "City is not created yet");
        require(cities[tokenId].initialized == false , "City is already initialized");
        require(cities[tokenId].owner == owner, "City is owned by someone else");
        
        City storage city = cities[tokenId];
        for(uint i = 0; i < numOfBuildings; i++) {
            city.buildingList[i].startx = uint32(startx[i]);
            city.buildingList[i].starty = uint32(starty[i]);
            city.buildingList[i].endx = uint32(endx[i]);
            city.buildingList[i].endy = uint32(endy[i]);
            city.buildingList[i].buildingType = stringToType[buildingType[i]];
            city.buildingList[i].orientation = uint32(orientation[i]);
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            city.specialBuildingList[i-numOfBuildings].startx = uint32(startx[i]);
            city.specialBuildingList[i-numOfBuildings].starty = uint32(starty[i]);
            city.specialBuildingList[i-numOfBuildings].endx = uint32(endx[i]);
            city.specialBuildingList[i-numOfBuildings].endy = uint32(endy[i]);
            city.specialBuildingList[i-numOfBuildings].specialType = specialType[i-numOfBuildings];
            city.buildingList[i].orientation = uint32(orientation[i]);
        }
        city.numOfBuildings = uint32(numOfBuildings);
        city.numOfSpecialBuildings = uint32(numOfSpecialBuildings);
        city.username = username;
        city.income = uint32(income);
        city.money = startingMoney;
        city.owner = owner;
        city.initialized = true;
        if(gameStart != 2000000000) city.incomesReceived = uint32((block.timestamp - gameStart) / payPeriod);
        else city.incomesReceived = 0;
    }

*/