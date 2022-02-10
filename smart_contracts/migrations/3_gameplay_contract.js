const Gameplay = artifacts.require("Gameplay");

module.exports = function (deployer) {
  deployer.deploy(Gameplay);
};
