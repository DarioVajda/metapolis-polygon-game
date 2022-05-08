// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./CityContract.sol";
import { BST } from "./BST.sol";

contract Gameplay is Ownable {

    constructor(address _admin, address _nftContractAddress) {
        initStringToType();
        admin = _admin;
        nftContractAddress = _nftContractAddress;
        CityContract contr = CityContract(nftContractAddress);
        contr.initGameplayContract(address(this));
    }

    // #region Util functions, structs,...

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
        string username;
        bool created;
        bool initialized;
        uint64 numOfBuildings;
        uint64 numOfSpecialBuildings;
        uint64 money;
        uint64 income;
        address owner;
        uint lastPay;
    } // occupies ( 4 + numOfBuildings + numOfSpecialBuildings ) blocks of 256 bytes in total

    // #endregion
    // #region Variables
    address admin;
    address nftContractAddress;
    bool editable = true;
    uint gameStart = 2000000000;
    uint payPeriod = 60; // 1 day = 86400

    mapping(uint => City) cities; // map (array) containing all the data about the City NFTs
    uint64 startingMoney = 100000; // the amount of in-game money everyone has right after minting

    mapping(uint => BST.Node) leaderboard;
    uint root = 10000;
    uint id = 0;
    // #endregion
    // #region Minting and transfering NFTs

    /**
     * @dev Function can only be called by the City Contract, it is called when initializing the city and giving it an owner
     * @param tokenId id of the city
     * @param addr is the address of the owner (person who just minted the city)
     */
    function created(uint tokenId, address addr) external {
        require(msg.sender == nftContractAddress, 'Has to be sent from the City Contract');
        cities[tokenId].owner = addr;
        cities[tokenId].created = true;
    }

    /**
     * @dev Function can only be called by the City Cotract, it is called beforeTokenTransfer and reassignes the owner value of the city nft
     * @param tokenId id of the city
     * @param _newOwner is the new owner of the nft with that id
     */
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
        // string calldata username,
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
        city.username = "Player";
        city.income = uint64(income);
        city.money = startingMoney;
        city.owner = owner;
        city.initialized = true;
        if(gameStart != 2000000000) city.lastPay = block.timestamp - ((block.timestamp - gameStart) % payPeriod);
        else city.lastPay = 0;

        root = BST.insert(leaderboard, root, income, id); // income should be the 'score' of the player

        id++;
    }

    // #endregion
    // #region Changing the cities
    
    /**
     * @dev Function to change the username
     * @param tokenId id of the nft
     * @param _username new username
     */
    function changeusername(uint tokenId, string calldata _username) external {
        require(msg.sender == cities[tokenId].owner);

        cities[tokenId].username = _username;
    }

    /**
     * @dev Function that will change the income of a city - should be called when building, upgrading or deleting something
     * @param tokenId id of the city
     * @param newIncome new income
     */
    function changeIncome(uint tokenId, uint newIncome) external onlyAdmin isEditable {
        uint score = cities[tokenId].income;
        root = BST.remove(leaderboard, root, score, tokenId);
        cities[tokenId].income = uint64(newIncome);
        score = cities[tokenId].income;
        root = BST.insert(leaderboard, root, score, tokenId);
    }

    /**
     * @dev Function upgrading a building at the index in the list
     * @param tokenId id of the city
     * @param price the price of upgrading the building
     * @param buildingIndex the index of the building in the list 
     */
    function upgradeBuilding(uint tokenId, uint price, uint buildingIndex) external onlyAdmin isEditable {
        cities[tokenId].buildingList[buildingIndex].level += 1;
        cities[tokenId].money = cities[tokenId].money - uint64(price);
    }

    /**
     * @dev Function adding a new building into the city
     * @param tokenId id of the city
     * @param price of the building
     * @param _startx x starting coordinate
     * @param _starty y starting coordinate
     * @param _endx x ending coordinate
     * @param _endy y ending coordinate
     * @param _buildingType a string that represents a building type
     */
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

        // Ovo je zakomentarisano jer ce se izvrsavati u posebnoj funkciji
        // uint score = cities[tokenId].money + cities[tokenId].income * 7;
        // root = BST.remove(leaderboard, root, score, tokenId);
        // cities[tokenId].income = uint64(newIncome);
        // score = cities[tokenId].income;
        // root = BST.insert(leaderboard, root, score, tokenId);
    }

    /**
     * @dev Function adding a new building into the city
     * @param tokenId id of the city
     * @param price of the building
     * @param _startx x starting coordinate
     * @param _starty y starting coordinate
     * @param _endx x ending coordinate
     * @param _endy y ending coordinate
     * @param _specialType a string that represents a building type
     */
    function addSpecialBuilding(
        uint tokenId,
        uint price,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        string calldata _specialType
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

    /**
     * @dev Function used for removing a building from a city
     * @param tokenId id of the city
     * @param value that will be refunded for selling/removing a building from the city
     * @param buildingIndex is the index of the building in the list
     */
    function removeBuilding(uint tokenId, uint value, uint buildingIndex) external onlyAdmin isEditable {
        // curr building getting values from last building in the list
        cities[tokenId].buildingList[buildingIndex].buildingType = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].buildingType;
        cities[tokenId].buildingList[buildingIndex].startx = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].startx;
        cities[tokenId].buildingList[buildingIndex].starty = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].starty;
        cities[tokenId].buildingList[buildingIndex].endx = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].endx;
        cities[tokenId].buildingList[buildingIndex].endy = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].endy;
        cities[tokenId].buildingList[buildingIndex].level = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].level;
        
        // cities[tokenId].buildingList[buildingIndex] = cities[tokenId].buildingList[cities[tokenId].numOfBuildings];

        cities[tokenId].money = cities[tokenId].money + uint64(value);

        cities[tokenId].numOfBuildings = cities[tokenId].numOfBuildings - 1;
    }
    
    /**
     * @dev Function used for removing a building from a city
     * @param tokenId id of the city
     * @param value that will be refunded for selling/removing a building from the city
     * @param buildingIndex is the index of the building in the list
     */
    function removeSpecialBuilding(uint tokenId, uint value, uint buildingIndex) external onlyAdmin isEditable {
        // curr building getting values from last building in the list
        cities[tokenId].specialBuildingList[buildingIndex].specialType = cities[tokenId].specialBuildingList[cities[tokenId].numOfSpecialBuildings].specialType;
        cities[tokenId].specialBuildingList[buildingIndex].startx = cities[tokenId].specialBuildingList[cities[tokenId].numOfSpecialBuildings].startx;
        cities[tokenId].specialBuildingList[buildingIndex].starty = cities[tokenId].specialBuildingList[cities[tokenId].numOfSpecialBuildings].starty;
        cities[tokenId].specialBuildingList[buildingIndex].endx = cities[tokenId].specialBuildingList[cities[tokenId].numOfSpecialBuildings].endx;
        cities[tokenId].specialBuildingList[buildingIndex].endy = cities[tokenId].specialBuildingList[cities[tokenId].numOfSpecialBuildings].endy;
        
        cities[tokenId].money = cities[tokenId].money + uint64(value);

        cities[tokenId].numOfSpecialBuildings = cities[tokenId].numOfSpecialBuildings - 1;
    }

    /**
     * @dev Function that starts the game, income will begin to be calculated and received (this happens by chaning the 'gameStart' value to current block.timestamp and setting at 'lastPay' for all cities)
     */
    function startGameIncome() external onlyAdmin isEditable {
        require(gameStart == 2000000000, "Game was already started");
        gameStart = block.timestamp;
        uint i = 0;
        while(cities[i].owner != address(0)) {
            cities[i].lastPay = gameStart;
            i++;
        }
    }

    /**
     * @dev Function getting the income for a city if conditions are met
     * @param tokenId id of the city
     */
    function getIncome(uint tokenId) external onlyAdmin isEditable {
        require(block.timestamp > gameStart, "Game did not start yet.");
        require(block.timestamp - cities[tokenId].lastPay > payPeriod, "Can't get income yet.");

        uint n = (block.timestamp - cities[tokenId].lastPay) / payPeriod;
        cities[tokenId].money += uint64(n) * cities[tokenId].income;
        cities[tokenId].lastPay = block.timestamp - ((block.timestamp - gameStart) % payPeriod);
    }

    // #endregion
    // #region Getting data from the contract

    /**
     * @dev Function returns true if the cities are editable, and false if they are not
     */
    function getEditableState() external view returns(bool) {
        return editable;
    }

    struct CityRepresentation {
        address owner;
        uint numOfBuildings;
        uint numOfSpecialBuildings;
        string username;
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
            username: city.username,
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

    // returns an array of indices that correspod to the IDs of the sorted cities
    function getTree() external view returns(BST.Node[] memory) {
        BST.Node[] memory r = new BST.Node[](id);
        for(uint i = 0; i < id; i++) {
            r[i] = leaderboard[i];
        }
        return r;
    } 

    // #endregion
    // #region Modifiers and other functions

    // returns the timestamp from the blockchain
    function getBlockchainTime() external view returns(uint) {
        return block.timestamp;
    }

    // changes the time required to pass to receive income
    function changePayPeriod(uint _payPeriod) external onlyAdmin {
        payPeriod = _payPeriod;
    }

    // modifier is used to check if the person who called the function is the Admin
    modifier onlyAdmin() {
        require(msg.sender == admin, 'The caller of the function is not admin');
        _;
    }

    // function that can change the Admin address in case a proble occurs - can be calles only by the owner
    function changeAdmin(address newAdmin) external onlyOwner {
        admin = newAdmin;
    }

    // modifier is used to check if the cities can be edited - they won't be editable only if a major problem occurs
    modifier isEditable() {
        require(editable == true, 'The blockchain database can not be edited at the moment');
        _;
    }

    // function is called to restrict editing data on the blockchain
    function flipEditableState() public onlyOwner {
        editable = !editable;
    }

    // #endregion
    // #region Dev options

    function devSetMoney(uint tokenId, uint _money) external {
        require(msg.sender == cities[tokenId].owner);

        cities[tokenId].money = uint64(_money);
    }

    // City gone, reduced to atoms...
    function devDemolishCity(uint tokenId) external {
        require(msg.sender == cities[tokenId].owner);

        cities[tokenId].numOfBuildings = 0;
        cities[tokenId].numOfSpecialBuildings = 0;
    }

    // #endregion
}