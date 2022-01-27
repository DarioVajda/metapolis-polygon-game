const CityContract = artifacts.require("CityContract");

module.exports = function (deployer) {
  deployer.deploy(CityContract);
};
