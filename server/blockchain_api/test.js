const ethers = require("ethers");
const fs = require("fs");

const provider = new ethers.providers.JsonRpcProvider(
	'https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44'
);
const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
var contractAddress;
var abi

contractAddress = '0x4C7B2ca5D1E807485457007eB29dE1c7c2293dDD';
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/CityContract.json").toString().trim()).abi;
var account = wallet.connect(provider);
var city = new ethers.Contract(
	contractAddress,
	abi,
	account
);

contractAddress = '0xFEfe341e5871A7CF998102c9AF46dCb9A0F8ef6f';
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Weth.json").toString().trim()).abi;
var weth = new ethers.Contract(
    contractAddress,
    abi,
    account
);

contractAddress = '0x5755c8Bdf367Cc4AE6AB3463289B6601842b654e';
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var game = new ethers.Contract(
    contractAddress,
    abi,
    account
);

async function main() {
    var tx;
    var reciept;
    // tx = await weth.mint(wallet.address, ethers.utils.parseEther('1'));
    // reciept = await tx.wait();
    // var balance = await weth.balanceOf(wallet.address);
    // balance = balance.toString();
    // console.log(balance);
    
    // tx = await city.flipSaleState();
    // reciept = await tx.wait();
    // console.log(reciept)

    // tx = await city.changeMintingPrice(ethers.utils.parseEther('0.005'));
    // reciept = await tx.wait();
    // console.log(reciept);

    // tx = await weth.increaseAllowance(city.address, ethers.utils.parseEther('0.025'));
    // reciept = await tx.wait()
    // tx = await city.wethMint(5, {gasLimit: 1e7});
    // reciept = await tx.wait();
    // console.log(reciept)

    // tx = await city.maticMint(1, {value: ethers.utils.parseEther('2')});
    // reciept = await tx.wait();
    // console.log(reciept);
    
    // var balance = await weth.balanceOf(wallet.address);
    // balance = balance.toString();
    // console.log("balance =", balance);
    // var currId = await city.currId();
    // currId = currId.toNumber();
    // console.log("currId =", currId);
    
    // tx = await city.withdraw({gasLimit: 1e7});
    // reciept = await tx.wait();
    // console.log(reciept);

    // tx = await game.initializeCity(wallet.address, 0, 2, 0, [3, 4], [4, 5], [5, 6], [6, 7], ['house', 'office'], [], 125000);
    // reciept = await tx.wait();
    // console.log(reciept);

    // tx = await game.startGameIncome();
    // reciept = await tx.wait();
    // console.log(reciept);

    // tx = await game.getIncome(0, {gasLimit: 1e6});
    // reciept = await tx.wait();
    // console.log(reciept);
}

main();