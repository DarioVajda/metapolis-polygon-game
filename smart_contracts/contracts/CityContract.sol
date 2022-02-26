// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./PriceContract.sol";

/* TEST PRIMER: 
city.safeMint(1, {value: web3.utils.toWei('0.1', 'ether'), from: accounts[1]})
game.initializeCity(accounts[1], 0, 2, 0, [3, 4], [4, 5], [5, 6], [6, 7], ['house', 'office'], [], 125000)
*/

contract CityContract is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, PriceContract {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter; // counter representing the latest tokenId

    IERC20 public weth;
    constructor(address _weth, address _maticPrice, address _ethPrice) ERC721("CityBuilders", "CTB") PriceContract(_ethPrice, _maticPrice) { 
        weth = IERC20(_weth);
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3000/cities"; // this is just temporary
    }
  
    uint mintingPrice = 0.1 ether; // cost of minting a single City NFT (in ether wei)
    bool saleIsActive = false; // if it is possible to mint more NFTs the state is true
    uint maxMintTokens = 10; // max num of tokens to mint per address
    uint MAX_CITIES = 10000; // max num of cities to be minted

    /**
     * @dev Function that changes the price of minting an NFT
     * @param newPrice the new price of the NFTs in ether wei
     */
    function changeMintingPrice(uint newPrice) external onlyOwner {
        mintingPrice = newPrice;
    }

    /**
     * @dev Function used for minting new City NFTs
     * @param numOfTokens number of tokens that will be minted
     */
    function maticMint(uint numOfTokens) external payable {
        require(saleIsActive, "Sale must be active to mint a City NFT");
        require(numOfTokens <= maxMintTokens, "Can only mint 10 tokens at a time");
        require(totalSupply().add(numOfTokens) <= MAX_CITIES, "Purchase would exceed max number of City NFTs");
        require(mintPriceMatic(mintingPrice) <= msg.value, "Matic value sent is not correct");

        createNFTs(numOfTokens);
    }

    /**
     * @dev Function used for minting new City NFTs
     * @param numOfTokens number of tokens that will be minted
     */
    function wethMint(uint numOfTokens) external {
        require(saleIsActive, "Sale must be active to mint a City NFT");
        require(numOfTokens <= maxMintTokens, "Can only mint 10 tokens at a time");
        require(totalSupply().add(numOfTokens) <= MAX_CITIES, "Purchase would exceed max number of City NFTs");

        weth.transferFrom(msg.sender, address(this), mintingPrice*numOfTokens);

        createNFTs(numOfTokens);
    }

    // function used to mint NFTs - called from wethMint and maticMint functions only
    function createNFTs(uint numOfTokens) private {
        uint256 tokenId;
        for(uint i = 0; i < numOfTokens; i++) {
            tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();

            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, Strings.toString(tokenId));
        }

        if(_tokenIdCounter.current() == MAX_CITIES) {
            saleIsActive = false;
        }
    }
    //_______________________________________________________________________________
    // funkcions returning values from the contract:
    function currId() public view returns(uint) {
        return _tokenIdCounter.current();
    }

    function getSaleState() external view returns(bool) {
        return saleIsActive;
    }
    //_______________________________________________________________________________

    // The following function is used to withdraw all funds from the contract to the owner address
    function withdraw() public onlyOwner {
        uint maticBalance = address(this).balance;
        payable(msg.sender).transfer(maticBalance);

        uint ethBalance = weth.balanceOf(address(this));
        weth.transfer(msg.sender, ethBalance);
    }

    // The following  function is called to start the sale and to end it if all items are sold out or if a problem occurs.
    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
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