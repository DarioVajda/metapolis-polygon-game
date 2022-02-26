// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Weth is ERC20, Ownable {
    constructor() ERC20("Weth", "WETH") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}