const Gameplay = artifacts.require("Gameplay");

module.exports = function (deployer) {
  let address = '0x764cDA7eccc6a94C157742e369b3533D15d047c0';
  deployer.deploy(Gameplay, address);
};
