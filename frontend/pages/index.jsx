import Head from 'next/head';
import { useEffect, useState } from "react"
import { ethers } from 'ethers';

import CityContract from '../../smart_contracts/build/contracts/CityContract.json'
import Weth from '../../smart_contracts/build/contracts/Weth.json'

import Nav from '../components/Home/Nav';
import DevOptions from '../components/Home/DevOptions';
import MintSection from '../components/Home/MintSection';
import HomeCity from '../components/Home/HomeCity';
import Roadmap from '../components/Home/Roadmap';
// import Prizes from '../components/Home/Prizes';
import Walkthrough from '../components/Home/Walkthrough/Walkthrough';
import FAQs from '../components/Home/FAQs';
import AboutUs from '../components/Home/AboutUs';

import styles from "../styles/Home.module.css";

import contractAddresses from '../../smart_contracts/contract-address.json';

const networkID = 80001; // ovo je sad ID od mumbai testneta, ali kasnije ce biti ID od polygon mainneta!

// trebalo bi da postoji promenljiva koja pokazuje koliko je do sad NFT-ova mintovano (samo treba cityContract.currId() da se pozove)

export default function Home() {
  
  //#region Minting the NFTs
  
  var cityContract;
  var wethContract;
  
  const cityContractAddress = contractAddresses.city;
  const wethContractAddress = contractAddresses.weth;
  
  const connectWallet = async () => {
    let res;
    if(cityContract === undefined) res = await initContracts();
    if(res !== undefined && res.error !== undefined) return res;
    
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  };
  
  async function initContracts() {
    if(!window.ethereum) return { error: 'no wallet' };

    if(cityContract && wethContract) return; // the contracts are already initialized

    const provider = new ethers.providers.Web3Provider(window.ethereum); // pravi se provider koji daje vezu sa blockchainom
    const signer = provider.getSigner(); // signer koji se daje kao argument pri povezivanju sa contractom
    
    cityContract = new ethers.Contract(cityContractAddress, CityContract.abi, signer); // povezivanje sa contractom za mintovanje i slicne stvari
    wethContract = new ethers.Contract(wethContractAddress, Weth.abi, signer);
  }

  const isRightNetwork = () => {
    // function that is checking for the connected network so that you can't mint with z
    if(window.ethereum === undefined) return;
    if(parseInt(window.ethereum.networkVersion) === networkID) {
      return true;
    }
    else {
      return false;
    }
  }

  const ethToMatic = async (ethPrice) => {
    var res = await (await fetch("https://api.binance.com/api/v3/aggTrades?symbol=MATICETH")).json(); // request to the binance api for the matic-eth price
    
    // calculating the average price:
    var price = 0;
    for(let i = 0; i < res.length; i++) {
      price = price + Number(res[i].p);
    }
    price /= res.length;

    return ethPrice / price; // returning the price in 'MATIC'
  }
  
  const maticMint = async (onlyPrice, num) => {
    let ethPrice = 0.001; // this should be loaded from somewhere
    
    let maticPrice = await ethToMatic(ethPrice * num); // converting the eth price to matic
    let epsilon = 0.1; // extra value to prevent unsuccessful mint transactions because of a price inagreement
    
    if(onlyPrice) {
      return {maticPrice: maticPrice, epsilon: epsilon}; // returning the price if onlyPrice is true
    }
    
    let res = await connectWallet(); // getting the wallet address
    if(res.error !== undefined) {
      return res; // handling errors (e.g. no connected wallet)
    }
    
    try {
      // calling the mint function in the smart contract
      let tx = await cityContract.maticMint(
        num, 
        { 
          value: ethers.utils.parseEther(`${maticPrice + epsilon}`), 
          gasLimit: 3e6, 
          maxPriorityFeePerGas: 100e9, 
          maxFeePerGas: (100e9)+16
        }
      );
      let receipt = await tx.wait();
    }
    catch(e) {
      return { error: 'tx1 rejected' };
    }
    
    return {};
  };
  
  const wethMint = async (onlyPrice, num) => {
    let account = await connectWallet();
    if(account.error !== undefined) {
      return account;
    } // checking for errors
    
    console.log(wethContract);
    let balance = await wethContract.balanceOf(account); // getting the weth balance of the account

    let wethPrice = 0.1 * num; // this should be loaded from somewhere (the price which may vary)
    if(onlyPrice) return wethPrice; // this returns the price if the function is called like this: wethMint(true);

    let reciept;
    let tx;

    let allowance = await wethContract.allowance(account, cityContract.address); // the current allowance
    allowance /= 1e18;
    if(allowance < wethPrice) {
      try {
        // increasing the allowance
        tx = await wethContract.increaseAllowance(
          cityContract.address, 
          ethers.utils.parseEther(`${wethPrice-allowance}`),
          { gasLimit: 1e6, maxPriorityFeePerGas: 100e9, maxFeePerGas: (100e9)+16 }
        );
        console.log({ tx });
        reciept = await tx.wait();
      }
      catch(e) { 
        return { error: 'tx1 rejected' };
      }
    }

    try { 
      // calling the mint function
      tx = await cityContract.wethMint(num, { gasLimit: 3e6, maxPriorityFeePerGas: 100e9, maxFeePerGas: (100e9)+16 });
      reciept = await tx.wait(); 
    }
    catch(e) {
      return { error: 'tx2 rejected' }; 
    }

    balance = await wethContract.balanceOf(account);

    return {};
  }
  //#endregion

  const numOfNFTs = async () => {
    // await initContracts();
    // console.log(cityContract);
    // let num = await cityContract.totalSupply();

    let num = await (await fetch('https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/count')).json();
    num = num.count;
    // console.log(num);

    return num;
  }

  //#region Dev Options

  const mintERC20 = async () => {
    const addr = await connectWallet();
    const tx = await wethContract.mint(
      addr, 
      ethers.utils.parseEther('20'),
      { gasLimit: 1e6, maxPriorityFeePerGas: 100e9, maxFeePerGas: (100e9)+16 }
    );
    const receipt = await tx.wait();
    // console.log(receipt);
    var balance = await wethContract.balanceOf(addr);
    balance = balance.toString();
    console.log('curr balance: ', balance);
    console.log('addr: ', addr);
  }

  const withdrawTokens = async () => {
    console.log(cityContract);
    let tx = await cityContract.withdraw({ gasLimit: 1e6, maxPriorityFeePerGas: 100e9, maxFeePerGas: (100e9)+16 });
    let receipt = await tx.wait();
    console.log(receipt);
  }

  //#endregion


  useEffect(() => {
    // initContracts();
  }, []);

  return (
    <div>
      <Head>
        <title>City Builder</title>
      </Head>
      <main>
        <Nav connectWallet={false} homeScreen={true} />
        <div className={styles.wrapper}>
          <div className={styles.scrollable}>
            <div id="mint">
              <MintSection maticMint={maticMint} wethMint={wethMint} networkCheck={isRightNetwork} numOfNFTs={numOfNFTs} />
            </div>
            <div id="roadmap">
              <Roadmap />
            </div>
          </div>
          <div className={styles.city}>
            <HomeCity />
          </div>
        </div>
        {/* <div id="prizes">
          <Prizes />
        </div> */}
        <div id="walkthrough">
          <Walkthrough />
        </div>
        <div id="faqs">
          <FAQs />
        </div>
        <div id="about-us">
          <AboutUs />
        </div>
        <DevOptions mintERC20={() => mintERC20()} withdraw={withdrawTokens} />
      </main>
    </div>
  )
}