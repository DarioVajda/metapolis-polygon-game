// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CityBuilders is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CityBuilders", "CTB") {}

    uint mintingPrice = 0.1 ether;
    bool saleIsActive = false;
    uint maxMintTokens = 10;
    uint MAX_CITIES = 10000;

    struct Building {
        uint16 buildingType;
        uint32 startx;
        uint32 starty;
        uint32 endx;
        uint32 endy;
    } // occupies 1 block of 256 bytes

    struct City {
        Building[] buildingList;
        uint128 money;
        uint128 income;
    } // occupies 2 blocks of 256 bytes in total

    mapping(address => City) players;
    uint128 startingMoney = 100000;

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3000";
    }

    function safeMint(uint numOfTokens) public payable {
        require(saleIsActive, "Sale must be active to mint a City NFT");
        require(numOfTokens <= maxMintTokens, "Can only mint 10 tokens at a time");
        require(totalSupply().add(numOfTokens) <= MAX_CITIES, "Purchase would exceed max number of City NFTs");
        require(mintingPrice.mul(numOfTokens) <= msg.value, "Ether value sent is not correct");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        players[msg.sender] = generateRandomCity();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encode("/players/", tokenId)));
    }




    // LATER TO BE SEPERATED FROM THIS CONTRACT:
    function generateRandomCity() internal view returns(City memory) {
        Building[] memory newBuildingList;

        return City({
            buildingList: newBuildingList,
            money: startingMoney,
            income: calculateIncome(newBuildingList)
        });
    }

    function calculateIncome(Building[] memory buildings) internal pure returns(uint128) {
        return 50000;
    }
    //_____________________________________________________________________________________



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

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // This function is called to start the sale and to end it if all items are sold out or if a problem occurs.
    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
}