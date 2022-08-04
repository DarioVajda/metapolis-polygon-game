// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./CityContract.sol";

contract Gameplay {
    // #region Constructor

    constructor(address _admin, address _nftContractAddress) {
        // initStringToType();
        owner = msg.sender;
        admin = _admin;
        nftContractAddress = _nftContractAddress;
        CityContract contr = CityContract(nftContractAddress);
        contr.initGameplayContract(address(this));
    }

    // #endregion
    // #region Util functions, structs,...
    
    struct Building {
        string buildingType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
        uint32 level;
        uint32 orientation;
        uint32 id;
    } // occupies 1 block of 256 bytes

    struct SpecialBuilding {
        string specialType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
        uint32 orientation;
        uint32 id;
    } // occupies 2 block of 256 bytes

    struct City {
        mapping(uint => Building) buildingList;
        mapping(uint => SpecialBuilding) specialBuildingList;
        mapping(uint => string) specialBuildingCash; // list of special buildings that were aquired through offers
        // string username;
        bool created;
        bool initialized;
        uint32 theme;
        uint32 numOfBuildings;
        uint32 buildingId; // curr id of the buildings
        uint32 numOfSpecialBuildings;
        uint32 specialBuildingId; // curr id of the special building
        uint32 numOfSpecialBuildingCash; // number of special buildings aquired through offers
        uint64 money;
        uint32 income;
        uint32 incomesReceived;
        address owner;
    } // occupies ( 4 + numOfBuildings + numOfSpecialBuildings + numOfSpecialBuildingCash ) blocks of 256 bytes in total

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
        uint64 value; // value of the offer (ingame money)
        uint64 user; // id of the user who made the offer
        bool filled;
    }

    struct SpecialBuildingType {
        uint32 count; // how many can be built
        uint32 numOfOffers;
        uint32 rarity;
        bool soldOut; // bool indicating if special building is sold out or not
        mapping(uint => SpecialOffer) offers; // list of offers (not sorted)
    }
    mapping(string => SpecialBuildingType) specialData;

    /**
     * @dev Funkcija koja u contractu pravi novi tip specijalnih gradjevina
     * @param key je 'kljuc' (string) novog tipa specijalnih gradjevina
     * @param count je broj koliko moze tih gradjevina da se napravi ukupno
     */
    function addSpecialBuildingType(string memory key, uint32 count, uint32 rarity) external onlyAdmin {
        SpecialBuildingType storage typeData = specialData[key];

        require(typeData.count == 0 && !typeData.soldOut, "Key exists");

        typeData.count = count;
        typeData.rarity = rarity;
        // typeData.offers = new SpecialOffer[](0);
        typeData.numOfOffers = 0;
    }

    /**
     * @dev Funkcija koja vraca podatke o nekom tipu specijalnih gradjevina
     * @param key je kljuc tipa
     */
    function getSpecialBuildingType(string memory key) external view returns(
        uint count,
        uint numOfOffers,
        uint rarity,
        bool soldOut,
        SpecialOffer[] memory offers
    ) {
        SpecialBuildingType storage typeData = specialData[key];

        count = typeData.count;
        numOfOffers = typeData.numOfOffers;
        rarity = typeData.rarity;
        soldOut = typeData.soldOut;
        offers = new SpecialOffer[](typeData.numOfOffers);

        for(uint i = 0; i < numOfOffers; i++) {
            offers[i] = typeData.offers[i];
        }
    }

    /**
     * @dev Funkcija koja omogucava serveru da napravi offer
     * @param key je kljuc tipa
     * @param makerId je id grada sa kojeg se pravi offer
     * @param value je cena u ingame novcu koja je predlozena
     */
    function makeSpecialOffer(string memory key, uint64 makerId, uint64 value) external onlyAdmin isEditable {
        SpecialBuildingType storage typeData = specialData[key];
        
        require(typeData.soldOut, "CantOffer");
        require(typeData.numOfOffers < 1000, 'MaxOffers');

        typeData.offers[typeData.numOfOffers] = SpecialOffer({ value: value, user: makerId, filled: false });
        typeData.numOfOffers++;
    }

    /**
     * @dev Funkcija koja omogucava serveru da ponisti neki offer
     * @param key je kljuc tipa
     * @param user je index offera u listi
     * @param value value of the offer
     */
    function cancelSpecialOffer(string memory key, uint user, uint value) public onlyAdmin isEditable {
        SpecialBuildingType storage typeData = specialData[key];
        
        uint index = typeData.numOfOffers;
        for(uint i = 0; i < typeData.numOfOffers; i++) {
            if(typeData.offers[i].user == user && typeData.offers[i].value == value) {
                index = i;
                break;
            }
        }

        require(index < typeData.numOfOffers, 'InvalidIndex');

        typeData.numOfOffers--;
        typeData.offers[index] = typeData.offers[typeData.numOfOffers];
    }

    // #endregion
    // #region Minting and transfering NFTs

    /**
     * @dev Function can only be called by the City Contract, it is called when initializing the city and giving it an owner
     * @param tokenId id of the city
     * @param addr is the address of the owner (person who just minted the city)
     */
    function created(uint tokenId, address addr) external {
        require(msg.sender == nftContractAddress, 'Fail');
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
        require(msg.sender == nftContractAddress, 'Fail');
        cities[tokenId].owner = _newOwner;
    }

    /**
     * @dev Function used for setting the 'initialized' field of a city to true
     * @param tokenId index of the token being initialized
     */
    function initializeCity(
        address _owner,
        uint tokenId,
        uint32 theme
    ) external onlyAdmin isEditable {
        require(cities[tokenId].created , "NotCreated");
        require(!cities[tokenId].initialized , "Initialized");
        require(cities[tokenId].owner == _owner, "WrongOwner");
        
        City storage city = cities[tokenId];
        
        city.money = startingMoney;
        city.theme = theme;
        city.initialized = true;

        if(gameStart != 2000000000) {
            city.incomesReceived = uint32((block.timestamp - gameStart) / payPeriod);
        }
        else {
            city.incomesReceived = 0;
        }
    }

    // #endregion
    // #region Changing the cities

    function getBuildingId(uint tokenId, uint buildingId, bool special) internal view returns(uint) {
        City storage city = cities[tokenId];

        if(special) {
            for(uint i = 0; i < city.numOfSpecialBuildings; i++) {
                if(buildingId == city.specialBuildingList[i].id) return i;
            }
        }
        else {
            for(uint i = 0; i < city.numOfBuildings; i++) {
                if(buildingId == city.buildingList[i].id) return i;
            }
        }
        revert('NotFound');
    }

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
     * @param buildingId id of the building to be upgraded 
     */
    function upgradeBuilding(uint tokenId, uint buildingId) external onlyAdmin isEditable {
        City storage city = cities[tokenId];

        uint buildingIndex = getBuildingId(tokenId, buildingId, false);

        city.buildingList[buildingIndex].level++;
    }

    /**
     * @dev Function adding a new building into the city
     * @param tokenId id of the city
     * @param _startx x starting coordinate
     * @param _starty y starting coordinate
     * @param _endx x ending coordinate
     * @param _endy y ending coordinate
     * @param _orientation the orientation of a building
     * @param _buildingType a string that represents a building type
     */
    function addBuilding(
        uint tokenId,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _orientation,
        uint _level,
        string calldata _buildingType
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        city.buildingList[city.numOfBuildings] = Building({
            buildingType: _buildingType,
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy),
            level: uint32(_level),
            orientation: uint32(_orientation),
            id: city.buildingId
        });
        city.buildingId++;
        city.numOfBuildings++;
    }

    /**
     * @dev Function adding a new building into the city
     * @param tokenId id of the city
     * @param _startx x starting coordinate
     * @param _starty y starting coordinate
     * @param _endx x ending coordinate
     * @param _endy y ending coordinate
     * @param _specialType a string that represents a building type
     * @param _orientation the orientation of a building
     * @param throughOffer is true if buying through an offer and false if buying normaly
     */
    //  * @param offerIndex is the index of the offer in the offer list for that special building type
    function addSpecialBuilding(
        uint tokenId,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _orientation,
        string calldata _specialType,
        bool throughOffer
        // uint cashIndex
        // uint offerIndex
    ) external onlyAdmin isEditable {
        require(throughOffer || specialData[_specialType].count > 0, 'SoldOut');

        City storage city = cities[tokenId];

        if(!throughOffer) {
            specialData[_specialType].count--; // decreasing the number of special buildings left to build
            if(specialData[_specialType].count == 0) {
                specialData[_specialType].soldOut = true;
            }
        }
        else {
            uint cashIndex = city.numOfSpecialBuildingCash;
            for(uint i = 0; i < city.numOfSpecialBuildingCash; i++) {
                if(keccak256(abi.encodePacked(_specialType)) == keccak256(abi.encodePacked(city.specialBuildingCash[i]))) {
                    cashIndex = i;
                    break;
                }
            }
            require(cashIndex < city.numOfSpecialBuildingCash, 'CashNotFound');

            city.numOfSpecialBuildingCash--; // decreasing the num of special buildings cashed for that player
            city.specialBuildingCash[cashIndex] = city.specialBuildingCash[city.numOfSpecialBuildingCash]; // moving the last element to the index of the deleted element

            // cancelSpecialOffer(_specialType, offerIndex); // removing the offer from the list because it got filled
        }
        
        city.specialBuildingList[city.numOfSpecialBuildings] = SpecialBuilding({
            specialType: _specialType,
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy),
            orientation: uint32(_orientation),
            id: city.specialBuildingId
        });
        city.specialBuildingId++;
        city.numOfSpecialBuildings++;
    }

    /**
     * @dev Function used for removing a building from a city
     * @param tokenId id of the city
     * @param buildingId is the index of the building in the list
     */
    function removeBuilding(uint tokenId, uint buildingId) external onlyAdmin isEditable {
        City storage city = cities[tokenId];

        uint buildingIndex = getBuildingId(tokenId, buildingId, false);

        city.numOfBuildings--;
        city.buildingList[buildingIndex] = city.buildingList[city.numOfBuildings];

    }
    
    /**
     * @dev Function used for removing a building from a city
     * @param tokenId id of the city
     * @param buildingId is the index of the building in the list
     * @param throughOffer is true if selling through an offer and false if selling normaly
     * @param buyerId is the ID of the city that made the offer
     */
    function removeSpecialBuilding(
        uint tokenId,
        uint buildingId,
        bool throughOffer,
        uint buyerId,
        uint offerValue
    ) external onlyAdmin isEditable {
        City storage city = cities[tokenId];
        uint buildingIndex = getBuildingId(tokenId, buildingId, true);
        SpecialBuildingType storage typeData = specialData[city.specialBuildingList[buildingIndex].specialType];

        uint offerIndex = typeData.numOfOffers;
        for(uint i = 0; i < typeData.numOfOffers; i++) {
            if(typeData.offers[i].user == buyerId && typeData.offers[i].value == offerValue) {
                offerIndex = i;
                break;
            }
        }

        require(buildingIndex < city.numOfSpecialBuildings && (!throughOffer || tokenId != buyerId), 'I/O'); // wrong index or the owner is the same as the person who made the offer
        require(!throughOffer || (offerIndex < typeData.numOfOffers && !typeData.offers[offerIndex].filled), 'invalidOffer');

        if(!throughOffer) {
            typeData.count++;
            typeData.soldOut = false;
        }
        else {
            City storage buyerCity = cities[buyerId];
            buyerCity.specialBuildingCash[buyerCity.numOfSpecialBuildingCash] = city.specialBuildingList[buildingIndex].specialType; // adding a special building to the cash list of the city to who it was sold
            buyerCity.numOfSpecialBuildingCash++; // increasing the num of special buildings cashed for that player
            typeData.offers[offerIndex].filled = true; // marking the offer as filled
        }

        city.numOfSpecialBuildings--;

        city.specialBuildingList[buildingIndex] = city.specialBuildingList[city.numOfSpecialBuildings];
    }

    /**
     * @dev Function for rotating a building
     * @param tokenId the id of the city
     * @param buildingId id of the building to be rotated
     * @param _orientation the new orientation of the building
     */
    function rotate(uint tokenId, uint buildingId, uint _orientation) external onlyAdmin isEditable {
        City storage city = cities[tokenId];

        uint buildingIndex = getBuildingId(tokenId, buildingId, false);

        city.buildingList[buildingIndex].orientation = uint32(_orientation);
    }

    /**
     * @dev Function for rotating a building
     * @param tokenId the id of the city
     * @param buildingId id of the special building to be rotated
     * @param _orientation the new orientation of the building
     */
    function rotateSpecial(uint tokenId, uint buildingId, uint _orientation) external onlyAdmin isEditable {
        City storage city = cities[tokenId];

        uint buildingIndex = getBuildingId(tokenId, buildingId, true);

        city.specialBuildingList[buildingIndex].orientation = uint32(_orientation);
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
        City storage city = cities[tokenId];

        require(block.timestamp > gameStart, "NotStarted");
        require(block.timestamp > city.incomesReceived * payPeriod + gameStart, "Fail");

        uint n = (block.timestamp - gameStart) / payPeriod - city.incomesReceived;
        city.money += uint32(n * income);
        city.incomesReceived += uint32(n);
    }

    // #endregion
    // #region Getting data from the contract

    /**
     * @dev Function returns true if the cities are editable, and false if they are not
     */
    function getEditableState() external view returns(bool) {
        return editable;
    }

    /*

    struct CityRepresentation {
        address owner;
        uint numOfBuildings;
        uint numOfSpecialBuildings;
        uint numOfSpecialBuildingCash;
        // string username;
        bool created;
        bool initialized;
        uint32 theme;
        uint[] startx;
        uint[] starty;
        uint[] endx;
        uint[] endy;
        uint[] orientation;
        uint[] id;
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
        uint numOfSpecialBuildingCash = city.numOfSpecialBuildingCash;
        CityRepresentation memory r = CityRepresentation({
            owner: city.owner,
            numOfBuildings: numOfBuildings,
            numOfSpecialBuildings: numOfSpecialBuildings,
            numOfSpecialBuildingCash: numOfSpecialBuildingCash,
            // username: city.username,
            created: city.created,
            initialized: city.initialized,
            theme: city.theme,
            startx: new uint[](numOfBuildings + numOfSpecialBuildings),
            starty: new uint[](numOfBuildings + numOfSpecialBuildings),
            endx: new uint[](numOfBuildings + numOfSpecialBuildings),
            endy: new uint[](numOfBuildings + numOfSpecialBuildings),
            orientation: new uint[](numOfBuildings + numOfSpecialBuildings),
            id: new uint[](numOfBuildings + numOfSpecialBuildings),
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
            r.buildingType[i] = city.buildingList[i].buildingType;
            r.level[i] = city.buildingList[i].level;
            r.id[i] = city.buildingList[i].id;
        }
        for(uint i = numOfBuildings; i < numOfSpecialBuildings + numOfBuildings; i++) {
            r.startx[i] = city.specialBuildingList[i-numOfBuildings].startx;
            r.starty[i] = city.specialBuildingList[i-numOfBuildings].starty;
            r.endx[i] = city.specialBuildingList[i-numOfBuildings].endx;
            r.endy[i] = city.specialBuildingList[i-numOfBuildings].endy;
            r.orientation[i] = city.specialBuildingList[i-numOfBuildings].orientation;
            r.specialType[i-numOfBuildings] = city.specialBuildingList[i-numOfBuildings].specialType;
            r.id[i] = city.specialBuildingList[i-numOfBuildings].id;
        }
        for(uint i = 0; i < numOfSpecialBuildingCash; i++) {
            r.specialBuildingCash[i] = city.specialBuildingCash[i];
        }
        return r;
    } // returns a struct with all the data about the city with the 'tokenId' ID

    */

    function getNumOfPlayers() external view returns(uint) {
        return id;
    }

    function getCityData(uint tokenId) external view returns(
        address cityOwner,
        bool cityCreated,
        bool initialized,
        uint32 theme,
        uint money,
        uint income,
        uint incomesReceived,
        Building[] memory buildingList,
        SpecialBuilding[] memory specialBuildingList,
        string[] memory specialBuildingCash,
        uint buildingId,
        uint specialBuildingId
    ) {
        City storage city = cities[tokenId];
        cityOwner = city.owner;
        cityCreated = city.created;
        initialized = city.initialized;
        theme = city.theme;
        money = city.money;
        income = city.income;
        incomesReceived = city.incomesReceived;
        buildingId = city.buildingId;
        specialBuildingId = city.specialBuildingId;

        buildingList = new Building[](city.numOfBuildings);
        for(uint i = 0; i < city.numOfBuildings; i++) buildingList[i] = city.buildingList[i];

        specialBuildingList = new SpecialBuilding[](city.numOfSpecialBuildings);
        for(uint i = 0; i < city.numOfSpecialBuildings; i++) specialBuildingList[i] = city.specialBuildingList[i];

        specialBuildingCash = new string[](city.numOfSpecialBuildingCash);
        for(uint i = 0; i < city.numOfSpecialBuildingCash; i++) specialBuildingCash[i] = city.specialBuildingCash[i];
    }


    // struct Score {
    //     uint score;
    //     bool initialized;
    // }
    // returns an array of indices that correspod to the IDs of the sorted cities
    function getScore(uint tokenId) external view returns(uint, bool) {
        // Score memory r = Score({score: scores[tokenId], initialized: cities[tokenId].initialized});
        // return r;
        return (scores[tokenId], cities[tokenId].initialized);
    } 

    // #endregion
    // #region Modifiers and other functions

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
        require(editable, 'IsntEditable');
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

    // #endregion
}