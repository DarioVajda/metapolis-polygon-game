// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

import Link from 'next/link'
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
import Walkthrough from '../components/Walkthrough/Walkthrough';
import FAQs from '../components/FAQs';
import AboutUs from '../components/AboutUs';

import styles from "../styles/Home.module.css";

// trebalo bi da postoji promenljiva koja pokazuje koliko je do sad NFT-ova mintovano (samo treba cityContract.currId() da se pozove)

export default function Home() {

  var cityContract;
  var wethContract;
  
  const cityContractAddress = '0xd33492774322634Cc12ae7ABe9e5218aFC537906';
  const wethContractAddress = '0x774EBC799E346de4b992764b85d0073a1A4C4143';
  
  async function initContracts() {
    if(!window.ethereum) return { error: 'no wallet' };

    console.log('sad se inicijalizuju contractovi');

    const provider = new ethers.providers.Web3Provider(window.ethereum); // pravi se provider koji daje vezu sa blockchainom
    const signer = provider.getSigner(); // signer koji se daje kao argument pri povezivanju sa contractom
    
    cityContract = new ethers.Contract(cityContractAddress, CityContract.abi, signer); // povezivanje sa contractom za mintovanje i slicne stvari
    wethContract = new ethers.Contract(wethContractAddress, Weth.abi, signer);
  }

  //#region Functions for minting the NFTs
  const ethToMatic = async (ethPrice) => {
    var res = await (await fetch("https://api.binance.com/api/v3/aggTrades?symbol=MATICETH")).json();
    var price = 0;
    for(let i = 0; i < res.length; i++) {
      price = price + Number(res[i].p);
    }
    price /= res.length;
    return ethPrice / price;
  }
  
  const maticMint = async (onlyPrice, num) => {
    let ethPrice = 0.001; // this should be loaded from somewhere
    
    let maticPrice = await ethToMatic(ethPrice * num);
    let epsilon = 0.1;
    
    if(onlyPrice) {
      return {maticPrice: maticPrice, epsilon: epsilon};
    }
    
    let res = await connectWallet();
    if(res.error !== undefined) {
      return res;
    }
    
    try {
      let tx = await cityContract.maticMint(num, { value: ethers.utils.parseEther(`${maticPrice + epsilon}`) });
      let receipt = await tx.wait();
      console.log('Mint receipt:', receipt);
    }
    catch(e) {
      console.log(e);
      return { error: 'tx1 rejected' };
    }
    
    return {};
  };
  
  const wethMint = async (onlyPrice, num) => {
    let account = await connectWallet();
    if(account.error !== undefined) {
      return account;
    }
    
    let balance = await wethContract.balanceOf(account);
    console.log('balance1: ', balance);

    let wethPrice = 0.1 * num;
    if(onlyPrice) return wethPrice; // this returns the price if the function is called like this: wethMint(true);

    let reciept;
    let tx;
    try {
      tx = await wethContract.increaseAllowance(cityContract.address, ethers.utils.parseEther(`${wethPrice}`)); // there should be a check if the current allowance is enough
      reciept = await tx.wait();
    }
    catch(e) { 
      console.log('error', e); 
      return { error: 'tx1 rejected' };
    }

    try { 
      tx = await cityContract.wethMint(num, {gasLimit: 1e7});
      reciept = await tx.wait(); 
    }
    catch(e) {
      console.log('error', e); 
      return { error: 'tx1 rejected' }; 
    }

    console.log(reciept);
    balance = await wethContract.balanceOf(account);
    console.log('balance2: ', balance);

    return {};
  }
  //#endregion

  const numOfNFTs = async () => {
    let list = await (await fetch('http://0.0.0.0:8000/leaderboard')).json();
    return list.length;
  }

  const connectWallet = async () => {
    let res;
    if(cityContract === undefined) res = await initContracts();
    if(res !== undefined && res.error !== undefined) return res;

    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  };

  const mintERC20 = async () => {
    const addr = await connectWallet();
    const tx = await wethContract.mint(addr, ethers.utils.parseEther('1'));
    const receipt = await tx.wait();
    console.log(receipt);
    var balance = await wethContract.balanceOf(addr);
    balance = balance.toString();
    console.log(balance);
  }

  useEffect(() => {
    // initContracts();
  }, []);

  return (
    <div>
      <Head>
        <title>Ciy Builder</title>
      </Head>
      <main>
        <div>
          <Nav />
          <div className={styles.wrapper}>
            <div className={styles.scrollable}>
              <div id="mint">
                <MintSection maticMint={maticMint} wethMint={wethMint} numOfNFTs={numOfNFTs} />
              </div>
              <div id="roadmap">
                <Roadmap />
              </div>
            </div>
            <div className={styles.city}>
              <HomeCity />
            </div>
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
        </div>
      </main>
    </div>
  )
}
