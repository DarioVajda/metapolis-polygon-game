// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./PriceContract.sol";
import "./Gameplay.sol";
import "./Achievements.sol";

contract CityContract is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, PriceContract {
    using SafeMath for uint256;

    // #region Initialization

    uint private _tokenIdCounter = 0; // counter representing the latest tokenId

    IERC20 public weth;
    constructor(address _weth, address _maticPrice, address _ethPrice) ERC721("CityBuilders", "CTB") PriceContract(_ethPrice, _maticPrice) { 
        weth = IERC20(_weth);
    }

    Gameplay gameplayContract;
    bool gameplayContractInitialized = false;
    function initGameplayContract(address _gameplay) external {
        require(!gameplayContractInitialized, 'Already initialized');
        gameplayContract = Gameplay(_gameplay);
        gameplayContractInitialized = true;
    }

    address achievementContractAddress = address(0);
    bool achievementContractAddressInitialized = false;
    function initAchievementContract() external {
        require(!achievementContractAddressInitialized, 'Already initialized');
        achievementContractAddress = msg.sender;
        achievementContractAddressInitialized = true;
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/cities"; // this is just temporary
    }
  
    uint mintingPrice = 0.1 ether; // cost of minting a single City NFT (in ether wei)
    bool saleIsActive = false; // if it is possible to mint more NFTs the state is true
    uint maxMintTokens = 10; // max num of tokens to mint per address
    uint MAX_CITIES = 10000; // max num of cities to be minted

    // #endregion

    // #region Minting

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
            tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            gameplayContract.created(tokenId, msg.sender);

            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, Strings.toString(tokenId));
        }

        if(_tokenIdCounter == MAX_CITIES) {
            saleIsActive = false;
        }
    }

    // #endregion

    // #region Paying out the rewards:

    function sendMatic(uint receiverId, uint value) external {
        require(msg.sender == achievementContractAddress, 'Wrong sender');

        bool sent = payable(ownerOf(receiverId)).send(value);
        require(sent, 'Failed to send matic');
    }

    function sendWeth(uint receiverId, uint value) external {
        require(msg.sender == achievementContractAddress, 'Wrong sender');

        bool sent = weth.transfer(ownerOf(receiverId), value);
        require(sent, 'Failed to transfer weth');
    }

    // #endregion

    // #region Get functions

    function currId() public view returns(uint) {
        return _tokenIdCounter;
    }

    function getSaleState() external view returns(bool) {
        return saleIsActive;
    }
    // #endregion

    // #region Utils

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

    // #endregion

    // #region Overrides

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        gameplayContract.newOwner(tokenId, to);
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

    // #endregion
}