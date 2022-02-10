// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface AggregatorV3Interface {
    function latestRoundData() external view returns(
        uint80 roundId,
        int answer,
        uint startedAt,
        uint updatedAt,
        uint80 answeredInRound
    );
}
        
// ADDRESSES FOR THESE CONTRACT INSTANCES:
// mumbai testnet:
// eth:     0x0715A7794a1dc8e42615F059dD6e406A6594651A
// matic:   0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
// matic mainnet:
// eth:     0xF9680D99D6C9589e2a93a78A04A279e509205945
// matic:   0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
//      * the prices are scaled up by 1e8

contract PriceContract {
    AggregatorV3Interface maticPrice;
    AggregatorV3Interface ethPrice;

    constructor(address ethOracleAddress, address maticOracleAddress) {
        ethPrice = AggregatorV3Interface(ethOracleAddress);
        maticPrice = AggregatorV3Interface(maticOracleAddress);
    }

    function getEthPrice() private view returns(uint) {
        ( , int answer, , , ) = ethPrice.latestRoundData();

        return uint(answer);
    }
    function getMaticPrice() private view returns(uint) {
        ( , int answer, , , ) = maticPrice.latestRoundData();

        return uint(answer);
    }

    function mintPriceMatic(uint mintPrice) internal view returns(uint) {
        return mintPrice * getEthPrice() / getMaticPrice();
    }
}