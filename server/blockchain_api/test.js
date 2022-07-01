// sifra za skolski metamast wallet: nftigrica
// WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.
// patient pudding valid edit budget equal west pole canyon quality cannon toilet
const ethers = require("ethers");
const fs = require("fs");

const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/XTpCP18xP9ox0cc8xhOQ2NXxgCxcJV44");
const wallet = new ethers.Wallet("0x5ae5d0b3a78146ace82c8ca9a4d3cd5ca7d0dcb2c02ee21739e9b5433596702c");
var contractAddress;
var abi;
var account = wallet.connect(provider);

contractAddress = "0xF1E1D340C4106315783F5125a0b87478f24A3e64";
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Weth.json").toString().trim()).abi;
var weth = new ethers.Contract(contractAddress, abi, account);

contractAddress = "0x88b68D2926eD258e7988e4D1809c42b199574088";
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/CityContract.json").toString().trim()).abi;
var city = new ethers.Contract(contractAddress, abi, account);

contractAddress = "0xBb92dA58620905af251B098602C9124FAb97ECb3";
abi = JSON.parse(fs.readFileSync("../../smart_contracts/build/contracts/Gameplay.json").toString().trim()).abi;
var game = new ethers.Contract(contractAddress, abi, account);

async function main() {
  var tx;
  var receipt;
  // Funkcija koja poziva setMoney u serveru:
  //------------------------------------------
  // let body = { money: 10000000 };
  // let id = 12;
  // const response = await fetch(`http://localhost:8000/cities/${id}/dev/setmoney`, {
  //   method: "POST",
  //   mode: "cors",
  //   cache: "no-cache",
  //   credentials: "same-origin",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   redirect: "follow",
  //   referrerPolicy: "no-referrer",
  //   body: body,
  // });
  // console.log(response);

  // Funkcija koja mintuje weth tokene na moju adresu
  //------------------------------------------
  // tx = await weth.mint(wallet.address, ethers.utils.parseEther('100'));
  // receipt = await tx.wait();
  // var balance = await weth.balanceOf(wallet.address);
  // balance = balance.toString();
  // console.log(balance);

  // Funkcija koja pokrece zaradu u igri:
  //-------------------------------------------
  // tx = await game.startGameIncome({gasLimit: 1e6});
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja testira gameStart u contractu:
  //-------------------------------------------
  // let res = await game.gameIncomeStarted();
  // console.log(res);

  // Funkcija koja flippuje sale state
  // ------------------------------------------
  // tx = await city.flipSaleState();
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja menja cenu mintovanja
  // ------------------------------------------
  // tx = await city.changeMintingPrice(ethers.utils.parseEther('0.005'));
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja povecava allowence contractu za trosenje weth tokena sa moje adrese
  // ------------------------------------------
  // tx = await weth.increaseAllowance(city.address, ethers.utils.parseEther('0.025'));
  // receipt = await tx.wait()
  // tx = await city.wethMint(5, {gasLimit: 1e7});
  // receipt = await tx.wait();
  // console.log(receipt)

  // Funkcija koja mintuje NFT sa moje adrese
  // ------------------------------------------
  // tx = await city.maticMint(1, {value: ethers.utils.parseEther('2')});
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja proverava moj balance weth tokena
  // ------------------------------------------
  // var balance = await weth.balanceOf(wallet.address);
  // balance = balance.toString();
  // console.log("balance =", balance);
  // var currId = await city.currId();
  // currId = currId.toNumber();
  // console.log("currId =", currId);

  // Funkcija koja salje Marku weth tokene
  // ------------------------------------------
  // let markovaAdresa = "0xC40e41385698b12Ead7ea73bD5c6AE4ea836c9fb";
  // tx = await weth.transfer(markovaAdresa, ethers.utils.parseEther("10"), { gasLimit: 1e7 });
  // receipt = await tx.wait();
  // console.log("receipt:", receipt);
  // let balance = await weth.balanceOf(markovaAdresa);
  // balance = balance.toString();
  // console.log("balance =", balance);

  // Funkcija koja withdrawuje sve sa contracta na moju adresu
  // ------------------------------------------
  // tx = await city.withdraw({gasLimit: 1e7});
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja iniciajlizuje grad... ovo je vec odradjeno
  // ------------------------------------------
  // tx = await game.initializeCity(wallet.address, 0, 2, 0, [3, 4], [4, 5], [5, 6], [6, 7], ['house', 'office'], [], 125000);
  // receipt = await tx.wait();
  // console.log(receipt);

  // Funkcija koja daje zaradu nultom gradu
  // ------------------------------------------
  // tx = await game.getIncome(0, {gasLimit: 1e6});
  // receipt = await tx.wait();
  // console.log(receipt);

  // VAZNO!!!!!!!!!!!!!!!!!!!
  // Funkcija koja vraca koje gradove poseduje neka osoba
  // ------------------------------------------
  // let addr = '0xC40e41385698b12Ead7ea73bD5c6AE4ea836c9fb' // markova adresa
  // addr = wallet.address;
  // let numOfNFTs = await city.balanceOf(addr);
  // numOfNFTs = numOfNFTs.toNumber();
  // console.log('numOfNFTs:', numOfNFTs);
  // let nfts = Array(numOfNFTs).fill(0);
  // let id;
  // for(let i = 0; i < numOfNFTs; i++) {
  //     id = await city.tokenOfOwnerByIndex(addr, i);
  //     id = id.toNumber();
  //     nfts[i] = id;
  // }
  // console.log('nfts:', nfts);
}

main();
