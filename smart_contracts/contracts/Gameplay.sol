// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./CityContract.sol";

contract Gameplay {
    // #region Constructor

    constructor(address _admin, address _nftContractAddress) {
        initStringToType();
        owner = msg.sender;
        admin = _admin;
        nftContractAddress = _nftContractAddress;
        CityContract contr = CityContract(nftContractAddress);
        contr.initGameplayContract(address(this));
    }

    // #endregion
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
        stringToType["supermarket"] = BuildingTypes.SuperMarket;
        stringToType["park"] = BuildingTypes.Park;
        stringToType["gym"] = BuildingTypes.Gym;

        typeToString[BuildingTypes.Factory] = "factory";
        typeToString[BuildingTypes.Office] = "office";
        typeToString[BuildingTypes.Restaurant] = "restaurant";
        typeToString[BuildingTypes.Building] = "building";
        typeToString[BuildingTypes.House] = "house";
        typeToString[BuildingTypes.Store] = "store";
        typeToString[BuildingTypes.SuperMarket] = "supermarket";
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
        uint32 orientation;
    } // occupies 1 block of 256 bytes

    struct SpecialBuilding {
        string specialType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
        uint32 orientation;
    } // occupies 2 block of 256 bytes

    struct City {
        mapping(uint => Building) buildingList;
        mapping(uint => SpecialBuilding) specialBuildingList;
        mapping(uint => string) specialBuildingCash; // list of special buildings that were aquired through offers
        // string username;
        bool created;
        bool initialized;
        uint32 numOfBuildings;
        uint32 numOfSpecialBuildings;
        uint32 numOfspecialBuildingCash; // number of special buildings aquired through offers
        uint64 money;
        uint32 income;
        uint32 incomesReceived;
        address owner;
    } // occupies ( 4 + numOfBuildings + numOfSpecialBuildings ) blocks of 256 bytes in total

    // #endregion
    // #region Variables
    address admin;
    address owner;
    uint id = 0;
    address nftContractAddress;
    bool editable = true;
    uint gameStart = 2000000000;
    uint payPeriod = 60; // 1 day = 86400

    mapping(uint => City) cities; // map (array) containing all the data about the City NFTs
    uint32 startingMoney = 100000; // the amount of in-game money everyone has right after minting

    mapping(uint => uint) scores;

    // #endregion
    // #region Special building utils

    struct SpecialOffer {
        uint128 value; // value of the offer (ingame money)
        uint128 user; // id of the user who made the offer
    }

    struct SpecialBuildingType {
        uint32 count; // how many can be built
        uint32 numOfOffers;
        bool soldOut; // bool indicating if special building is sold out or not
        mapping(uint => SpecialOffer) offers; // list of offers (not sorted)
    }
    mapping(string => SpecialBuildingType) specialData;

    /**
     * @dev Funkcija koja u contractu pravi novi tip specijalnih gradjevina
     * @param key je 'kljuc' (string) novog tipa specijalnih gradjevina
     * @param count je broj koliko moze tih gradjevina da se napravi ukupno
     */
    function addSpecialBuildingType(string memory key, uint32 count) external onlyAdmin {
        require(specialData[key].count == 0 && specialData[key].soldOut == false, "Key exists");

        specialData[key].count = count;
        // specialData[key].offers = new SpecialOffer[](0);
        specialData[key].numOfOffers = 0;
    }

    /**
     * @dev Funkcija koja vraca podatke o nekom tipu specijalnih gradjevina
     * @param key je kljuc tipa
     */
    struct SpecialBuildingTypeRepresentation {
        uint32 count;
        uint32 numOfOffers;
        bool soldOut;
        SpecialOffer[] offers;
    }
    function getSpecialBuildingType(string memory key) external view returns(SpecialBuildingTypeRepresentation memory) {
        SpecialBuildingTypeRepresentation memory r = SpecialBuildingTypeRepresentation({
            count: specialData[key].count,
            numOfOffers: specialData[key].numOfOffers,
            soldOut: specialData[key].soldOut,
            offers: new SpecialOffer[](specialData[key].numOfOffers)
        });
        for(uint i = 0; i < specialData[key].numOfOffers; i++) {
            r.offers[i].value = specialData[key].offers[i].value;
            r.offers[i].user = specialData[key].offers[i].user;
        }
        return r;
    }

    /**
     * @dev Funkcija koja omogucava serveru da napravi offer
     * @param key je kljuc tipa
     * @param makerId je id grada sa kojeg se pravi offer
     * @param value je cena u ingame novcu koja je predlozena
     */
    function makeSpecialOffer(string memory key, uint128 makerId, uint128 value) external onlyAdmin isEditable {
        require(specialData[key].soldOut == true, "CantOffer");
        require(specialData[key].numOfOffers < 1000, 'MaxOffers');

        specialData[key].offers[specialData[key].numOfOffers] = SpecialOffer({ value: value, user: makerId });
        specialData[key].numOfOffers++;
    }

    /**
     * @dev Funkcija koja omogucava serveru da ponisti neki offer
     * @param key je kljuc tipa
     * @param index je index offera u listi
     */
    function cancelSpecialOffer(string memory key, uint index) public onlyAdmin isEditable {
        require(index < specialData[key].numOfOffers, 'InvalidIndex');

        specialData[key].numOfOffers--;
        specialData[key].offers[index] = specialData[key].offers[specialData[key].numOfOffers];
    }

    // #endregion
    // #region Minting and transfering NFTs

    /**
     * @dev Function can only be called by the City Contract, it is called when initializing the city and giving it an owner
     * @param tokenId id of the city
     * @param addr is the address of the owner (person who just minted the city)
     */
    function created(uint tokenId, address addr) external {
        require(msg.sender == nftContractAddress, 'NotCityContract');
        cities[tokenId].owner = addr;
        cities[tokenId].created = true;
        id++;
    }

    /**
     * @dev Function can only be called by the City Cotract, it is called beforeTokenTransfer and reassignes the owner value of the city nft
     * @param tokenId id of the city
     * @param _newOwner is the new owner of the nft with that id
     */
    function newOwner(uint tokenId, address _newOwner) public {
        require(msg.sender == nftContractAddress, 'NotCityContract');
        cities[tokenId].owner = _newOwner;
    }

    /**
     * @dev Function used for setting the 'initialized' field of a city to true
     * @param tokenId index of the token being initialized
     */
    function initializeCity(
        address _owner,
        uint tokenId
    ) external onlyAdmin isEditable {
        require(cities[tokenId].created == true , "NotCreated");
        require(cities[tokenId].initialized == false , "AlreadyInitialized");
        require(cities[tokenId].owner == _owner, "WrongOwner");
        
        City storage city = cities[tokenId];
        
        city.money = startingMoney;
        city.initialized = true;
        if(gameStart != 2000000000) city.incomesReceived = uint32((block.timestamp - gameStart) / payPeriod);
        else city.incomesReceived = 0;
    }

    // #endregion
    // #region Changing the cities
    
    /**
     * @dev Function to change the username
     * @dev OVA FUNKCIJA TREBA DA SE PROMENI, NE TREBA MSG.SENDER DA BUDE OWNER GRADA NEGO SAMO DA BUDE FUNKCIJA OZNACENA SA ONLYADMIN!!!
     * @param tokenId id of the nft
     * @param _username new username
     */
    // function changeusername(uint tokenId, string calldata _username) external {
    //     require(msg.sender == cities[tokenId].owner);

    //     cities[tokenId].username = _username;
    // }

    /**
     * @dev Function that will change the income of a city - should be called when building, upgrading or deleting something
     * @param tokenId id of the city
     * @param newScore new score
     */
    function changeScore(uint tokenId, uint newScore) external onlyAdmin isEditable {
        scores[tokenId] = newScore;
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
     * @param _orientation the orientation of a building
     * @param _buildingType a string that represents a building type
     */
    function addBuilding(
        uint tokenId,
        uint price,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _orientation,
        string calldata _buildingType
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        city.buildingList[city.numOfBuildings] = Building({
            buildingType: stringToType[_buildingType],
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy),
            level: 0,
            orientation: uint32(_orientation)
        });
        city.numOfBuildings += 1;
        city.money = city.money - uint64(price);
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
     * @param _orientation the orientation of a building
     * @param throughOffer is true if buying through an offer and false if buying normaly
     * @param cashIndex is the index of the special building in the cash that is built
     */
    function addSpecialBuilding(
        uint tokenId,
        uint price,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _orientation,
        string calldata _specialType,
        bool throughOffer,
        uint cashIndex
    ) external onlyAdmin isEditable {
        require(throughOffer == true || specialData[_specialType].count > 0, 'SoldOut');

        City storage city = cities[tokenId];

        if(throughOffer == false) {
            specialData[_specialType].count--; // decreasing the number of special buildings left to build
        }
        else {
            city.numOfspecialBuildingCash--; // decreasing the num of special buildings cashed for that player
            city.specialBuildingCash[cashIndex] = city.specialBuildingCash[city.numOfspecialBuildingCash]; // moving the last element to the index of the deleted element
        }
        
        city.specialBuildingList[city.numOfSpecialBuildings] = SpecialBuilding({
            specialType: _specialType,
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy),
            orientation: uint32(_orientation)
        });
        city.numOfSpecialBuildings++;
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
        
        cities[tokenId].numOfBuildings = cities[tokenId].numOfBuildings - 1;

        cities[tokenId].buildingList[buildingIndex].buildingType = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].buildingType;
        cities[tokenId].buildingList[buildingIndex].startx       = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].startx;
        cities[tokenId].buildingList[buildingIndex].starty       = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].starty;
        cities[tokenId].buildingList[buildingIndex].endx         = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].endx;
        cities[tokenId].buildingList[buildingIndex].endy         = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].endy;
        cities[tokenId].buildingList[buildingIndex].level        = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].level;
        cities[tokenId].buildingList[buildingIndex].orientation  = cities[tokenId].buildingList[cities[tokenId].numOfBuildings].orientation;
        
        // cities[tokenId].buildingList[buildingIndex] = cities[tokenId].buildingList[cities[tokenId].numOfBuildings];

        cities[tokenId].money = cities[tokenId].money + uint64(value);
    }
    
    /**
     * @dev Function used for removing a building from a city
     * @param tokenId id of the city
     * @param value that will be refunded for selling/removing a building from the city
     * @param buildingIndex is the index of the building in the list
     * @param throughOffer is true if selling through an offer and false if selling normaly
     * @param buyerId is the ID of the city that made the offer
     */
    function removeSpecialBuilding(uint tokenId, uint value, uint buildingIndex, bool throughOffer, uint buyerId) external onlyAdmin isEditable {

        City storage city = cities[tokenId];

        if(throughOffer == false) {
            specialData[city.specialBuildingList[buildingIndex].specialType].count++;
        }
        else {
            cities[buyerId].specialBuildingCash[cities[buyerId].numOfspecialBuildingCash] = city.specialBuildingList[buildingIndex].specialType; // adding a special building to the cash list of the city to who it was sold
            cities[buyerId].numOfspecialBuildingCash++; // increasing the num of special buildings cashed for that player
        }

        city.numOfSpecialBuildings = city.numOfSpecialBuildings - 1;

        // curr building getting values from last building in the list
        city.specialBuildingList[buildingIndex].specialType = city.specialBuildingList[city.numOfSpecialBuildings].specialType;
        city.specialBuildingList[buildingIndex].startx      = city.specialBuildingList[city.numOfSpecialBuildings].startx;
        city.specialBuildingList[buildingIndex].starty      = city.specialBuildingList[city.numOfSpecialBuildings].starty;
        city.specialBuildingList[buildingIndex].endx        = city.specialBuildingList[city.numOfSpecialBuildings].endx;
        city.specialBuildingList[buildingIndex].endy        = city.specialBuildingList[city.numOfSpecialBuildings].endy;
        city.specialBuildingList[buildingIndex].orientation = city.specialBuildingList[city.numOfSpecialBuildings].orientation;

        city.money = city.money + uint64(value);
    }

    /**
     * @dev Function for rotating a building
     * @param tokenId the id of the city
     * @param buildingIndex index of the building in the list
     * @param _orientation the new orientation of the building
     */
    function rotate(uint tokenId, uint buildingIndex, uint _orientation) external onlyAdmin isEditable {
        cities[tokenId].buildingList[buildingIndex].orientation = uint32(_orientation);
    }

    /**
     * @dev Function for rotating a building
     * @param tokenId the id of the city
     * @param buildingIndex index of the building in the list
     * @param _orientation the new orientation of the building
     */
    function rotateSpecial(uint tokenId, uint buildingIndex, uint _orientation) external onlyAdmin isEditable {
        cities[tokenId].specialBuildingList[buildingIndex].orientation = uint32(_orientation);
    }

    /**
     * @dev Function that starts the game, income will begin to be calculated and received (this happens by chaning the 'gameStart' value to current block.timestamp and setting at 'lastPay' for all cities)
     */
    function startGameIncome() external onlyAdmin isEditable {
        require(gameStart == 2000000000, "Started");
        gameStart = block.timestamp;
        uint i = 0;
        while(cities[i].owner != address(0)) {
            cities[i].incomesReceived = 0;
            i++;
        }
    }

    /**
     * @dev Function getting the income for a city if conditions are met
     * @param tokenId id of the city
     * @param income the income of the city
     */
     // should receive how much is the income
    function getIncome(uint tokenId, uint income) external onlyAdmin isEditable {
        require(block.timestamp > gameStart, "NotStarted");
        require(block.timestamp > cities[tokenId].incomesReceived * payPeriod + gameStart, "Fail");

        uint n = (block.timestamp - gameStart) / payPeriod - cities[tokenId].incomesReceived;
        cities[tokenId].money += uint32(n * income);
        cities[tokenId].incomesReceived += uint32(n);
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
        uint numOfSpecialBuildingCash;
        // string username;
        bool created;
        bool initialized;
        uint[] startx;
        uint[] starty;
        uint[] endx;
        uint[] endy;
        uint[] orientation;
        string[] buildingType;
        uint[] level;
        string[] specialType;
        string[] specialBuildingCash;
        uint money;
        uint income;
        uint incomesReceived;
    } // this is a struct used for returning values from the blockchain
    function getCityData(uint tokenId) external view returns(CityRepresentation memory) {
        City storage city = cities[tokenId];
        uint numOfBuildings = city.numOfBuildings;
        uint numOfSpecialBuildings  = city.numOfSpecialBuildings;
        uint numOfSpecialBuildingCash = city.numOfspecialBuildingCash;
        CityRepresentation memory r = CityRepresentation({
            owner: city.owner,
            numOfBuildings: numOfBuildings,
            numOfSpecialBuildings: numOfSpecialBuildings,
            numOfSpecialBuildingCash: numOfSpecialBuildingCash,
            // username: city.username,
            created: city.created,
            initialized: city.initialized,
            startx: new uint[](numOfBuildings + numOfSpecialBuildings),
            starty: new uint[](numOfBuildings + numOfSpecialBuildings),
            endx: new uint[](numOfBuildings + numOfSpecialBuildings),
            endy: new uint[](numOfBuildings + numOfSpecialBuildings),
            orientation: new uint[](numOfBuildings + numOfSpecialBuildings),
            buildingType: new string[](numOfBuildings),
            level: new uint[](numOfBuildings),
            specialType: new string[](numOfSpecialBuildings),
            specialBuildingCash: new string[](numOfSpecialBuildingCash),
            money: city.money,
            income: city.income,
            incomesReceived: (gameStart == 2000000000) ? 0 : city.incomesReceived
        });
        for(uint i = 0; i < numOfBuildings; i++) {  
            r.startx[i] = city.buildingList[i].startx;
            r.starty[i] = city.buildingList[i].starty;
            r.endx[i] = city.buildingList[i].endx;
            r.endy[i] = city.buildingList[i].endy;
            r.orientation[i] = city.buildingList[i].orientation;
            r.buildingType[i] = typeToString[city.buildingList[i].buildingType];
            r.level[i] = city.buildingList[i].level;
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            r.startx[i] = city.specialBuildingList[i-numOfBuildings].startx;
            r.starty[i] = city.specialBuildingList[i-numOfBuildings].starty;
            r.endx[i] = city.specialBuildingList[i-numOfBuildings].endx;
            r.endy[i] = city.specialBuildingList[i-numOfBuildings].endy;
            r.orientation[i] = city.specialBuildingList[i-numOfBuildings].orientation;
            r.specialType[i-numOfBuildings] = city.specialBuildingList[i-numOfBuildings].specialType;
        }
        for(uint i = 0; i < numOfSpecialBuildingCash; i++) {
            r.specialBuildingCash[i] = city.specialBuildingCash[i];
        }
        return r;
    } // returns a struct with all the data about the city with the 'tokenId' ID

    function getNumOfPlayers() external view returns(uint) {
        return id;
    }


    struct Score {
        uint score;
        bool initialized;
    }
    // returns an array of indices that correspod to the IDs of the sorted cities
    function getScore(uint tokenId) external view returns(Score memory) {
        Score memory r = Score({score: scores[tokenId], initialized: cities[tokenId].initialized});
        return r;
    } 

    // #endregion
    // #region Modifiers and other functions

    // // returns the timestamp from the blockchain
    // function getBlockchainTime() external view returns(uint) {
    //     return block.timestamp;
    // }

    // changes the time required to pass to receive income
    function changePayPeriod(uint _payPeriod) external onlyAdmin {
        payPeriod = _payPeriod;
    }

    // modifier is used to check if the person who called the function is the Admin
    modifier onlyAdmin() {
        require(msg.sender == admin, 'NotAdmin');
        _;
    }

    // function that can change the Admin address in case a proble occurs - can be calles only by the owner
    function changeAdmin(address newAdmin) external {
        require(msg.sender == owner, '.');
        admin = newAdmin;
    }

    // modifier is used to check if the cities can be edited - they won't be editable only if a major problem occurs
    modifier isEditable() {
        require(editable == true, 'IsntEditable');
        _;
    }

    // function is called to restrict editing data on the blockchain
    function flipEditableState() public {
        require(msg.sender == owner, '.');
        editable = !editable;
    }

    // #endregion
    // #region Dev options

    function devSetMoney(uint tokenId, uint _money) external onlyAdmin {
        cities[tokenId].money = uint64(_money);
    }

    // City gone, reduced to atoms...
    function devDemolishCity(uint tokenId) external onlyAdmin {
        cities[tokenId].numOfBuildings = 0;
        cities[tokenId].numOfSpecialBuildings = 0;
    }

    // #endregion

    // #region Achievements

    // struct Achievement {
    //     uint max; // max number of people who can get the reward for the achievement
    //     uint start; // unix time
    //     uint end; // unix time
    //     string reward; // shows WHAT is the reward
    //     uint amound; // show HOW MUCH is rewarded
    // }

    // uint numOfAchievements = 0;
    // mapping(uint => Achievement) achievements;

    // #endregion
}