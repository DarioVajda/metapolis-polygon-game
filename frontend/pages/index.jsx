import Head from 'next/head';
import { useEffect, useState } from "react"
import { ethers } from 'ethers';

import CityContract from '../../smart_contracts/build/contracts/CityContract.json'
import Weth from '../../smart_contracts/build/contracts/Weth.json'

import Nav from '../components/Nav';
import DevOptions from '../components/DevOptions';
import MintSection from '../components/MintSection';
import HomeCity from '../components/HomeCity';
import Roadmap from '../components/Roadmap';
import Prizes from '../components/Prizes';
import Walkthrough from '../components/Walkthrough/Walkthrough';
import FAQs from '../components/FAQs';
import AboutUs from '../components/AboutUs';

import styles from "../styles/Home.module.css";

const networkID = 80001; // ovo je sad ID od mumbai testneta, ali kasnije ce biti ID od polygon mainneta!

// trebalo bi da postoji promenljiva koja pokazuje koliko je do sad NFT-ova mintovano (samo treba cityContract.currId() da se pozove)

export default function Home() {
  
  //#region Minting the NFTs
  
  var cityContract;
  var wethContract;
  
  const cityContractAddress = '0xd33492774322634Cc12ae7ABe9e5218aFC537906';
  const wethContractAddress = '0x774EBC799E346de4b992764b85d0073a1A4C4143';
  
  const connectWallet = async () => {
    let res;
    if(cityContract === undefined) res = await initContracts();
    if(res !== undefined && res.error !== undefined) return res;
    
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  };
  
  async function initContracts() {
    if(!window.ethereum) return { error: 'no wallet' };

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
      let tx = await cityContract.maticMint(num, { value: ethers.utils.parseEther(`${maticPrice + epsilon}`) });
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
    console.log(wethContract)
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
        tx = await wethContract.increaseAllowance(cityContract.address, ethers.utils.parseEther(`${wethPrice-allowance}`)); // there should be a check if the current allowance is enough
        reciept = await tx.wait();
      }
      catch(e) { 
        return { error: 'tx1 rejected' };
      }
    }

    try { 
      // calling the mint function
      tx = await cityContract.wethMint(num, {gasLimit: 1e7});
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
    let list = await (await fetch('http://localhost:8000/leaderboard')).json();
    return list.length;
  }

  //#region Dev Options

  const mintERC20 = async () => {
    const addr = await connectWallet();
    const tx = await wethContract.mint(addr, ethers.utils.parseEther('1'));
    const receipt = await tx.wait();
    // console.log(receipt);
    var balance = await wethContract.balanceOf(addr);
    balance = balance.toString();
    console.log('curr balance: ', balance);
  }

  //#endregion

  //#region Handling Popup Components 



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
        <Nav />
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
        <div id="prizes">
          <Prizes />
        </div>
        <div id="walkthrough">
          <Walkthrough />
        </div>
        <div id="faqs">
          <FAQs />
        </div>
        <div id="about-us">
          <AboutUs />
        </div>
        <DevOptions mintERC20={() => mintERC20()} />
      </main>
    </div>
  )
}