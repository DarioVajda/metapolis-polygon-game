// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// there are no checks if the request are valid or possible, it should be done in the backend.
// maybe later it will be added here too, but for now it is not necessary since only the admin can call the functions

contract Gameplay is Ownable {

    constructor() {
        initStringToType();
        admin = msg.sender; // this should later be passed in as an argument to the contructor
    }

    // ________________________________________________________________________
    enum BuildingTypes {
        Factory,
        Office,
        Restaurant,
        Parking,
        Building,
        House,
        Store,
        SuperMarket,
        Park,
        Gym
    }

    mapping(string => BuildingTypes) stringToType;
    mapping(BuildingTypes => string) typeToString;
    uint numOfBuildingTypes = 10;
    function initStringToType() private {
        stringToType["factory"] = BuildingTypes.Factory;
        stringToType["office"] = BuildingTypes.Office;
        stringToType["restaurant"] = BuildingTypes.Restaurant;
        stringToType["parking"] = BuildingTypes.Parking;
        stringToType["building"] = BuildingTypes.Building;
        stringToType["house"] = BuildingTypes.House;
        stringToType["store"] = BuildingTypes.Store;
        stringToType["superMarket"] = BuildingTypes.SuperMarket;
        stringToType["park"] = BuildingTypes.Park;
        stringToType["gym"] = BuildingTypes.Gym;

        typeToString[BuildingTypes.Factory] = "factory";
        typeToString[BuildingTypes.Office] = "office";
        typeToString[BuildingTypes.Restaurant] = "restaurant";
        typeToString[BuildingTypes.Parking] = "parking";
        typeToString[BuildingTypes.Building] = "building";
        typeToString[BuildingTypes.House] = "house";
        typeToString[BuildingTypes.Store] = "store";
        typeToString[BuildingTypes.SuperMarket] = "superMarket";
        typeToString[BuildingTypes.Park] = "park";
        typeToString[BuildingTypes.Gym] = "gym";
    }
    
    struct Building {
        BuildingTypes buildingType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
        uint32 level;
    } // occupies 1 block of 256 bytes

    struct SpecialBuilding {
        uint32 specialType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
    } // occupies 1 block of 256 bytes

    struct City {
        mapping(uint => Building) buildingList;
        mapping(uint => SpecialBuilding) specialBuildingList;
        uint64 numOfBuildings;
        uint64 numOfSpecialBuildings;
        uint64 money;
        uint64 income;
        address owner;
        uint lastPay;
    } // occupies ( 2 + numOfBuildings + numOfSpecialBuildings ) blocks of 256 bytes in total
    // ________________________________________________________________________

    uint MAX_CITIES = 10000; // max num of cities to be minted

    address admin;
    bool editable = true;
    uint gameStart = 2000000000;
    uint payPeriod = 120; // 1 day = 86400

    mapping(uint => City) cities; // map (array) containing all the data about the City NFTs
    uint64 startingMoney = 100000; // the amount of in-game money everyone has right after minting

    // ________________________________________________________________________
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
     */
    function initializeCity(
        address owner,
        uint tokenId,
        uint numOfBuildings,
        uint numOfSpecialBuildings,
        uint[] memory startx,
        uint[] memory starty,
        uint[] memory endx,
        uint[] memory endy,
        string[] memory buildingType,
        uint[] memory specialType,
        uint income
    ) external onlyAdmin isEditable {
        require(cities[tokenId].owner == address(0), "City is already initialized");
        
        City storage city = cities[tokenId];
        for(uint i = 0; i < numOfBuildings; i++) {
            city.buildingList[i].startx = uint32(startx[i]);
            city.buildingList[i].starty = uint32(starty[i]);
            city.buildingList[i].endx = uint32(endx[i]);
            city.buildingList[i].endy = uint32(endy[i]);
            city.buildingList[i].buildingType = stringToType[buildingType[i]];
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            city.specialBuildingList[i-numOfBuildings].startx = uint32(startx[i]);
            city.specialBuildingList[i-numOfBuildings].starty = uint32(starty[i]);
            city.specialBuildingList[i-numOfBuildings].endx = uint32(endx[i]);
            city.specialBuildingList[i-numOfBuildings].endy = uint32(endy[i]);
            city.specialBuildingList[i-numOfBuildings].specialType = uint32(specialType[i-numOfBuildings]);
        }
        city.numOfBuildings = uint64(numOfBuildings);
        city.numOfSpecialBuildings = uint64(numOfSpecialBuildings);
        city.income = uint64(income);
        city.money = startingMoney;
        city.owner = owner;
        if(gameStart != 2000000000) city.lastPay = block.timestamp - ((block.timestamp - gameStart) % payPeriod);
        else city.lastPay = 0;
    }
    
    // ________________________________________________________________________
    // functions that change the cities:
    function upgradeBuilding(uint tokenId, uint price, uint buildingIndex) external onlyAdmin isEditable {
        cities[tokenId].buildingList[buildingIndex].level += 1;
        cities[tokenId].money = cities[tokenId].money - uint64(price);
    }

    function addBuilding(
        uint tokenId,
        uint price,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        string calldata _buildingType
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        city.buildingList[city.numOfBuildings] = Building({
            buildingType: stringToType[_buildingType],
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy),
            level: 0
        });
        city.numOfBuildings += 1;
        city.money = city.money - uint64(price);
    }

    function addSpecialBuilding(
        uint tokenId,
        uint price,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _specialType
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        city.specialBuildingList[city.numOfSpecialBuildings] = SpecialBuilding({
            specialType: uint32(_specialType),
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy)
        });
        city.numOfSpecialBuildings += 1;
        city.money = city.money - uint64(price);
    }

    function startGameIncome() external onlyAdmin isEditable {
        require(gameStart == 2000000000, "Game was already started");
        gameStart = block.timestamp;
        uint i = 0;
        while(cities[i].owner != address(0)) {
            cities[i].lastPay = gameStart;
            i++;
        }
    }

    function getIncome(uint tokenId) external onlyAdmin isEditable {
        require(block.timestamp > gameStart, "Game did not start yet.");
        require(block.timestamp - cities[tokenId].lastPay > payPeriod, "Can't get income yet.");

        uint n = (block.timestamp - cities[tokenId].lastPay) / payPeriod;
        cities[tokenId].money += uint64(n) * cities[tokenId].income;
        cities[tokenId].lastPay = block.timestamp - ((block.timestamp - gameStart) % payPeriod);
    }
    //_______________________________________________________________________________
    // funkcije za dobijanje podata iz contract-a:
    function getEditableState() external view returns(bool) {
        return editable;
    } // returns true if the cities are editable, and false if they are not

    struct CityRepresentation {
        address owner;
        uint numOfBuildings;
        uint numOfSpecialBuildings;
        uint[] startx;
        uint[] starty;
        uint[] endx;
        uint[] endy;
        string[] buildingType;
        uint[] specialType;
        uint money;
        uint income;
        uint lastPay;
    } // this is a struct used for returning values from the blockchain

    function getBuildings(uint tokenId) external view returns(CityRepresentation memory) {
        City storage city = cities[tokenId];
        address owner = city.owner;
        uint numOfBuildings = city.numOfBuildings;
        uint numOfSpecialBuildings  = city.numOfSpecialBuildings;
        uint[] memory startx = new uint[](numOfBuildings + numOfSpecialBuildings);
        uint[] memory starty = new uint[](numOfBuildings + numOfSpecialBuildings);
        uint[] memory endx = new uint[](numOfBuildings + numOfSpecialBuildings);
        uint[] memory endy = new uint[](numOfBuildings + numOfSpecialBuildings);
        string[] memory buildingType = new string[](numOfBuildings);
        uint[] memory specialType = new uint[](numOfSpecialBuildings);
        uint money;
        uint income;
        uint lastPay;
        for(uint i = 0; i < numOfBuildings; i++) {
            startx[i] = city.buildingList[i].startx;
            starty[i] = city.buildingList[i].starty;
            endx[i] = city.buildingList[i].endx;
            endy[i] = city.buildingList[i].endy;
            buildingType[i] = typeToString[city.buildingList[i].buildingType];
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            startx[i] = city.specialBuildingList[i-numOfBuildings].startx;
            starty[i] = city.specialBuildingList[i-numOfBuildings].starty;
            endx[i] = city.specialBuildingList[i-numOfBuildings].endx;
            endy[i] = city.specialBuildingList[i-numOfBuildings].endy;
            specialType[i-numOfBuildings] = city.specialBuildingList[i-numOfBuildings].specialType;
        }
        income = city.income;
        money = city.money;
        lastPay = city.lastPay;
        return CityRepresentation({
            owner: owner,
            numOfBuildings: numOfBuildings,
            numOfSpecialBuildings: numOfSpecialBuildings,
            startx: startx,
            starty: starty,
            endx: endx,
            endy: endy,
            buildingType: buildingType,
            specialType: specialType,
            money: money,
            income: income,
            lastPay: lastPay
        });
    } // returns a struct with all the data about the city with the 'tokenId' ID

    function getMoney(uint tokenId) external view returns(uint) {
        return cities[tokenId].money;
    } // returns the money a city owns

    function getLastPay(uint tokenId) external view returns(uint) {
        return cities[tokenId].lastPay - gameStart;
    } // returns when was the last time city was payed

    function getBlockchainTime() external view returns(uint) {
        return block.timestamp;
    } // returns the timestamp from the blockchain
    //_______________________________________________________________________________


    // The following modifier is used to check if the person who called the function is the Admin
    modifier onlyAdmin() {
        require(msg.sender == admin, 'The caller of the function is not admin');
        _;
    }

    // The following modifier is used to check if the cities can be edited - they won't be editable only if a major problem occurs
    modifier isEditable() {
        require(editable == true, 'The blockchain database can not be edited at the moment');
        _;
    }

    // The following function is called to restrict editing data on the blockchain
    function flipEditableState() public onlyOwner {
        editable = !editable;
    }

    // function that can change the Admin address in case a proble occurs - can be calles only by the owner
    function changeAdmin(address newAdmin) external onlyOwner {
        admin = newAdmin;
    }
}