const CityContract = artifacts.require("CityContract");
const Weth = artifacts.require("Weth");
const Gameplay = artifacts.require("Gameplay");

module.exports = async function (deployer) {
  await deployer.deploy(Weth);
  let instance = await Weth.deployed();
  await deployer.deploy(CityContract, instance.address, '0x0715A7794a1dc8e42615F059dD6e406A6594651A', '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada');
  instance = await CityContract.deployed();
  await deployer.deploy(Gameplay, '0x764cDA7eccc6a94C157742e369b3533D15d047c0', instance.address); // adresa admina i adresa NFT contracta
};