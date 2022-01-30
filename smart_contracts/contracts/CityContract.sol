// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// trebam da napravim funkcije za upgradeovanje i gradjenje, ne treba mi provera argumenata jer funkciju moze da pozove samo owner
// dok api koji poziva ovu funkciju moze da pozove samo osoba koja poseduje nft datog


/* TEST PRIMER: 
instance.safeMint(1, {value: web3.utils.toWei('0.1', 'ether'), from: accounts[1]})
instance.initializeCity(accounts[1], 1, 2, 0, [3, 4], [3, 4], [3, 4], [3, 4], ['house', 'house'], [], 10000)

*/


contract CityContract is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter; // counter representing the latest tokenId

    constructor() ERC721("CityBuilders", "CTB") {
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
    } // occupies ( 2 + numOfBuildings + numOfSpecialBuildings ) blocks of 256 bytes in total
    // ________________________________________________________________________

    uint mintingPrice = 0.1 ether; // cost of minting a single City NFT
    bool saleIsActive = false; // if it is possible to mint more NFTs the state is true
    uint maxMintTokens = 10; // max num of tokens to mint per address
    uint MAX_CITIES = 10000; // max num of cities to be minted

    address admin;
    bool editable = true;

    mapping(uint => City) cities; // map (array) containing all the data about the City NFTs
    uint64 startingMoney = 100000; // the amount of in-game money everyone has right after minting

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3000/cities"; // this is just temporary
    }

    // ________________________________________________________________________
    // functions for creating the City NFTs:
    /**
     * @dev Function used for minting new City NFTs
     * @param numOfTokens number of tokens that will be minted
     */
    function safeMint(uint numOfTokens) external payable {
        require(saleIsActive, "Sale must be active to mint a City NFT");
        require(numOfTokens <= maxMintTokens, "Can only mint 10 tokens at a time");
        require(totalSupply().add(numOfTokens) <= MAX_CITIES, "Purchase would exceed max number of City NFTs");
        require(mintingPrice.mul(numOfTokens) <= msg.value, "Ether value sent is not correct");

        uint256 tokenId;
        for(uint i = 0; i < numOfTokens; i++) {
            tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();

            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, Strings.toString(tokenId)); // sets the tokenUri to "_baseURI/tokenId"
        }
        
        if(_tokenIdCounter.current() == MAX_CITIES) {
            flipSaleState();
        }
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
        uint[] memory specialType,
        uint income
    ) external onlyAdmin { // onlyOwner should maybe be replaced with ownsNFT() modifier
        require(cities[tokenId].owner == address(0), "City is already initialized");
        
        for(uint i = 0; i < numOfBuildings; i++) {
            if(uint(stringToType[buildingType[i]]) > numOfBuildingTypes) {
                revert("Invalid building type");
            }
            if(uint(stringToType[buildingType[i]]) == 3) {
                revert("You can't build parkings!");
            } // ovo ce trebati da se promeni, ne znam sto je jos uvek tu
        }

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
            city.specialBuildingList[i-numOfBuildings].starty = uint32(startx[i]);
            city.specialBuildingList[i-numOfBuildings].endx = uint32(startx[i]);
            city.specialBuildingList[i-numOfBuildings].endy = uint32(startx[i]);
            city.specialBuildingList[i-numOfBuildings].specialType = uint32(specialType[i-numOfBuildings]);
        }
        city.numOfBuildings = uint64(numOfBuildings);
        city.numOfSpecialBuildings = uint64(numOfSpecialBuildings);
        city.income = uint64(income);
        city.money = startingMoney;
        city.owner = owner;
    }
    
    // ________________________________________________________________________
    // functions that change the cities:
    function upgradeBuilding(uint tokenId, uint buildingIndex) external onlyAdmin {
        cities[tokenId].buildingList[buildingIndex].level += 1;
    }

    function addBuilding(
        uint tokenId,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        string calldata _buildingType
    ) external onlyAdmin {
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
    }

    function addSpecialBuilding(
        uint tokenId,
        uint _startx,
        uint _starty,
        uint _endx,
        uint _endy,
        uint _specialType
    ) external onlyAdmin {
        City storage city = cities[tokenId];
        city.specialBuildingList[city.numOfSpecialBuildings] = SpecialBuilding({
            specialType: uint32(_specialType),
            startx: uint32(_startx),
            starty: uint32(_starty),
            endx: uint32(_endx),
            endy: uint32(_endy)
        });
        city.numOfSpecialBuildings += 1;
    }


    //_______________________________________________________________________________
    // funkcije za debagovanje:

    function currId() public view returns(uint) {
        return _tokenIdCounter.current();
    }

    function getOwners() external view returns(address[] memory) {
        address[] memory adrese = new address[](currId());
        for(uint i = 0; i < currId(); i++) {
            adrese[i] = cities[i].owner;
        }
        return adrese;
    }

    function getTypes(uint tokenId) external view returns(uint[] memory) {
        uint[] memory types = new uint[](cities[tokenId].numOfBuildings);
        for(uint i = 0; i < cities[tokenId].numOfBuildings; i++) {
            types[i] = uint(cities[tokenId].buildingList[i].buildingType);
        }
        return types;
    }

    //_______________________________________________________________________________


    // The following modifier is used to check if a user owns the NFT which he wants to change.
    modifier onlyAdmin() {
        require(msg.sender == admin, 'The caller of the function is not admin');
        _;
    }

    modifier isEditable() {
        require(editable == true, 'The blockchain database can not be edited at the moment');
        _;
    }

    // The following function is used to withdraw all funds from the contract to the owner address
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // The following  function is called to start the sale and to end it if all items are sold out or if a problem occurs.
    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    // The following function is called to restrict editing data on the blockchain
    function flipEditableState() public onlyOwner {
        editable = !editable;
    }


    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
        return super.supportsInterface(interfaceId);
    }
}