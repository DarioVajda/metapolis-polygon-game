// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

import Link from 'next/link'
import Head from 'next/head';
import { useEffect, useState } from "react"
import { ethers } from 'ethers';

import CityContract from '../../smart_contracts/build/contracts/CityContract.json'
import Weth from '../../smart_contracts/build/contracts/Weth.json'

// trebalo bi da postoji promenljiva koja pokazuje koliko je do sad NFT-ova mintovano (samo treba cityContract.currId() da se pozove)

export default function Home() {

  var cityContract;
  var wethContract;
  
  const cityContractAddress = '0xfFa54608A33A9B91ff4321E67cc0ad713852ed33';
  const wethContractAddress = '0x4939F82d1a412A3ec3A550D3015B898E43634F6A';
  
  async function initContracts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // pravi se provider koji daje vezu sa blockchainom
    const signer = provider.getSigner(); // signer koji se daje kao argument pri povezivanju sa contractom
    
    cityContract = new ethers.Contract(cityContractAddress, CityContract.abi, signer); // povezivanje sa contractom za mintovanje i slicne stvari
    wethContract = new ethers.Contract(wethContractAddress, Weth.abi, signer);
  }
  
  const initCity = async () => {
    let addr = await connectWallet();
    let body = JSON.stringify({address: addr});
    console.log(body);
    const response = await fetch(`http://localhost:8000/cities/2/initialize`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: body
    });
    console.log(response);
  };

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
  
  const maticMint = async () => {
    if(!window.ethereum || cityContract === undefined) {
      return;
    }
    await connectWallet();
    
    let ethPrice = 0.001;
    
    let maticPrice = await ethToMatic(ethPrice);
    console.log(maticPrice);
    let epsilon = 0.1;
    let tx = await cityContract.maticMint(1, { value: ethers.utils.parseEther(`${maticPrice + epsilon}`) });
    let receipt = await tx.wait();
    console.log('Mint receipt:', receipt);

    // initCity();
  };
  
  const wethMint = async () => {
    if(!window.ethereum || cityContract === undefined) {
      return;
    }
    let account = await connectWallet();
    
    let balance = await wethContract.balanceOf(account);
    console.log('balance1: ', balance);
    let tx = await wethContract.increaseAllowance(cityContract.address, ethers.utils.parseEther('0.1'));
    let reciept = await tx.wait();
    tx = await cityContract.wethMint(1, {gasLimit: 1e7});
    reciept = await tx.wait();
    console.log(reciept);
    balance = await wethContract.balanceOf(account);
    console.log('balance2: ', balance);

    // initCity();
  }

  //#endregion

  const connectWallet = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  };

  useEffect(() => {
    initContracts();
  }, []);

  return (
    <div>
      <Head>
        <title>Ciy Builder</title>
      </Head>
      <main>
        <div> { /* This is going to be the top bar */ }
          <Link href="/"><a><h1>City Builder</h1></a></Link>
          <Link href="/game"><a><h2>Game</h2></a></Link>
          <Link href="#mint"><a><h2>Mint</h2></a></Link>
          <Link href="#roadmap"><a><h2>Roadmap</h2></a></Link>
          <Link href="#walkthrough"><a><h2>Walkthrough</h2></a></Link>
          <Link href="#faqs"><a><h2>FAQs</h2></a></Link>
        </div>
        <div id="mint">
          <h4 onClick={() => maticMint()}>
            This is the function used for minting with the MATIC token
          </h4>
          <h4 onClick={() => wethMint()}>
            This is the function used for minting with the WETH token
          </h4>
          <h4 onClick={() => connectWallet()}>
            This is the function used for connecting the ethereum wallet
            {/* Ova funkcija ce se nalaziti negde desno gore recimo i pokazivace da li je povezan wallet */}
          </h4>
        </div>
      </main>
    </div>
  )
}
