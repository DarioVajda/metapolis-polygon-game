const CityContract = artifacts.require("CityContract");
const Weth = artifacts.require("Weth");

module.exports = async function (deployer) {
  await deployer.deploy(Weth);
  let instance = await Weth.deployed();
  await deployer.deploy(CityContract, instance.address, '0x0715A7794a1dc8e42615F059dD6e406A6594651A', '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada');
};