// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "./CityContract.sol";

import {BST} from "./BST.sol";

// there are no checks if the request are valid or possible, it should be done in the backend.
// maybe later it will be added here too, but for now it is not necessary since only the admin can call the functions

contract Gameplay is Ownable {

    constructor(address _admin, address _nftContractAddress) {
        initStringToType();
        admin = _admin;
        nftContractAddress = _nftContractAddress;
        CityContract contr = CityContract(nftContractAddress);
        contr.initGameplayContract(address(this));
    }

    enum BuildingTypes {
        Factory,
        Office,
        Restaurant,
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
        stringToType["building"] = BuildingTypes.Building;
        stringToType["house"] = BuildingTypes.House;
        stringToType["store"] = BuildingTypes.Store;
        stringToType["superMarket"] = BuildingTypes.SuperMarket;
        stringToType["park"] = BuildingTypes.Park;
        stringToType["gym"] = BuildingTypes.Gym;

        typeToString[BuildingTypes.Factory] = "factory";
        typeToString[BuildingTypes.Office] = "office";
        typeToString[BuildingTypes.Restaurant] = "restaurant";
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
        string specialType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
    } // occupies 2 block of 256 bytes

    struct City {
        mapping(uint => Building) buildingList;
        mapping(uint => SpecialBuilding) specialBuildingList;
        bool created;
        bool initialized;
        uint64 numOfBuildings;
        uint64 numOfSpecialBuildings;
        uint64 money;
        uint64 income;
        address owner;
        uint lastPay;
    } // occupies ( 4 + numOfBuildings + numOfSpecialBuildings ) blocks of 256 bytes in total


    address admin;
    address nftContractAddress;
    bool editable = true;
    uint gameStart = 2000000000;
    uint payPeriod = 120; // 1 day = 86400

    mapping(uint => City) cities; // map (array) containing all the data about the City NFTs
    uint64 startingMoney = 100000; // the amount of in-game money everyone has right after minting

    mapping(uint => BST.Node) leaderboard;
    uint root = 10000;
    uint id = 0;

    function created(uint tokenId, address addr) external {
        cities[tokenId].owner = addr;
        cities[tokenId].created = true;
    }

    function newOwner(uint tokenId, address _newOwner) public {
        require(msg.sender == nftContractAddress, 'Has to be sent from the City Contract');
        cities[tokenId].owner = _newOwner;
    }

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
        string[] memory specialType,
        uint income
    ) external onlyAdmin isEditable {
        require(cities[tokenId].created == true , "City is not created yet");
        require(cities[tokenId].initialized == false , "City is already initialized");
        require(cities[tokenId].owner == owner, "City is owner by someone else");
        
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
            city.specialBuildingList[i-numOfBuildings].specialType = specialType[i-numOfBuildings];
        }
        city.numOfBuildings = uint64(numOfBuildings);
        city.numOfSpecialBuildings = uint64(numOfSpecialBuildings);
        city.income = uint64(income);
        city.money = startingMoney;
        city.owner = owner;
        city.initialized = true;
        if(gameStart != 2000000000) city.lastPay = block.timestamp - ((block.timestamp - gameStart) % payPeriod);
        else city.lastPay = 0;

        BST.insert(leaderboard, root, income, id);

        id++;
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
        string memory _specialType
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        city.specialBuildingList[city.numOfSpecialBuildings] = SpecialBuilding({
            specialType: _specialType,
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
        uint[] level;
        string[] specialType;
        uint money;
        uint income;
        uint lastPay;
    } // this is a struct used for returning values from the blockchain
    function getCityData(uint tokenId) external view returns(CityRepresentation memory) {
        City storage city = cities[tokenId];
        uint numOfBuildings = city.numOfBuildings;
        uint numOfSpecialBuildings  = city.numOfSpecialBuildings;
        CityRepresentation memory r = CityRepresentation({
            owner: city.owner,
            numOfBuildings: numOfBuildings,
            numOfSpecialBuildings: numOfSpecialBuildings,
            startx: new uint[](numOfBuildings + numOfSpecialBuildings),
            starty: new uint[](numOfBuildings + numOfSpecialBuildings),
            endx: new uint[](numOfBuildings + numOfSpecialBuildings),
            endy: new uint[](numOfBuildings + numOfSpecialBuildings),
            buildingType: new string[](numOfBuildings),
            level: new uint[](numOfBuildings),
            specialType: new string[](numOfSpecialBuildings),
            money: city.money,
            income: city.income,
            lastPay: (gameStart == 2000000000) ? gameStart : city.lastPay - gameStart
        });
        for(uint i = 0; i < numOfBuildings; i++) {  
            r.startx[i] = city.buildingList[i].startx;
            r.starty[i] = city.buildingList[i].starty;
            r.endx[i] = city.buildingList[i].endx;
            r.endy[i] = city.buildingList[i].endy;
            r.buildingType[i] = typeToString[city.buildingList[i].buildingType];
            r.level[i] = city.buildingList[i].level;
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            r.startx[i] = city.specialBuildingList[i-numOfBuildings].startx;
            r.starty[i] = city.specialBuildingList[i-numOfBuildings].starty;
            r.endx[i] = city.specialBuildingList[i-numOfBuildings].endx;
            r.endy[i] = city.specialBuildingList[i-numOfBuildings].endy;
            r.specialType[i-numOfBuildings] = city.specialBuildingList[i-numOfBuildings].specialType;
        }
        return r;
    } // returns a struct with all the data about the city with the 'tokenId' ID

    function getBlockchainTime() external view returns(uint) {
        return block.timestamp;
    } // returns the timestamp from the blockchain


    function changePayPeriod(uint _payPeriod) external onlyAdmin {
        payPeriod = _payPeriod;
    } // changes the time required to pass to receive income


    // The following modifier is used to check if the person who called the function is the Admin
    modifier onlyAdmin() {
        require(msg.sender == admin, 'The caller of the function is not admin');
        _;
    }

    // function that can change the Admin address in case a proble occurs - can be calles only by the owner
    function changeAdmin(address newAdmin) external onlyOwner {
        admin = newAdmin;
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
}