// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./CityContract.sol";

contract Achievements {

    CityContract cityContract;

    constructor(address _admin, address _city) {
        owner = msg.sender;
        admin = _admin;

        cityContract = CityContract(_city);
        cityContract.initAchievementContract();
    }

    mapping(string => Achievement) achievements; // list of achievements
    mapping(uint => Rewards) rewards; // list of rewards every person has aquired
    address admin; // admin can change data in the smart contract
    address owner; // owner can change the admin

    // #region Achievement progress
    struct Achievement {
        uint32 count; // number of people who completed the achievement
        bool created;
        mapping(uint => bool) completed;
    }

    // creating a new achievement in the contract
    function newAchievement(string memory key) external onlyAdmin {
        require(achievements[key].created == false, "CreatedAlready");

        achievements[key].created = true;
        achievements[key].count = 0;
    }

    // called when a person completed an achievement
    function completedAchievement(uint tokenId, string memory key, uint wethReward, uint maticReward) external onlyAdmin {
        require(achievements[key].created == true, 'NotCreated');
        require(achievements[key].completed[tokenId] == false, "CompletedAlready");

        achievements[key].count++;
        achievements[key].completed[tokenId] = true;

        if(wethReward > 0) {
            cityContract.sendWeth(tokenId, wethReward);
        }
        if(maticReward > 0) {
            cityContract.sendMatic(tokenId,maticReward);
        }
    }

    // returns the number of people who completed the achievement
    function getAchievementCount(string memory key) external view returns(uint32) {
        if(achievements[key].created == true) {
            return achievements[key].count;
        }
        else {
            return 0;
        }
    }

    // returns true if the person completed the achievement and false if he didn't
    function checkIfCompleted(uint tokenId, string memory key) external view returns(bool) {
        return achievements[key].completed[tokenId];
    }

    // #endregion

    // #region Achievement rewards - OVO JE NEPOTREBNO

    struct Rewards {
        uint numOfRewards;
        mapping(uint => string) rewardList;
    }

    function addReward(uint tokenId, string memory reward) external onlyAdmin {
        rewards[tokenId].rewardList[rewards[tokenId].numOfRewards] = reward;
        rewards[tokenId].numOfRewards++;
    }

    function removeReward(uint tokenId, uint index) external onlyAdmin {
        require(index < rewards[tokenId].numOfRewards, 'CantRemove');

        rewards[tokenId].numOfRewards--;
        rewards[tokenId].rewardList[index] = rewards[tokenId].rewardList[rewards[tokenId].numOfRewards];
    }

    function getRewardList(uint tokenId) external view returns(string[] memory) {
        string[] memory r = new string[](rewards[tokenId].numOfRewards);

        for(uint i = 0; i < rewards[tokenId].numOfRewards; i++) {
            r[i] = rewards[tokenId].rewardList[i];
        }

        return r;
    }

    // #endregion

    // #region Utils

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

    // #endregion
}