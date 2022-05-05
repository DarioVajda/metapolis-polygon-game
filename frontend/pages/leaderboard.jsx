import CityContract from '../../smart_contracts/build/contracts/CityBuilders.json'
import { ethers } from 'ethers';

import React, { useState, useRef, useEffect } from 'react'

import Nav from '../components/Nav'
import LeaderboardList from '../components/Leaderboard/LeaderboardList'

import styles from '../styles/leaderboard.module.css'


const leaderboard = () => {

  const [nfts, setNfts] = useState([]);

  var cityContract;
  const cityContractAddress = '0xd33492774322634Cc12ae7ABe9e5218aFC537906';
  const connecting = useRef(false);

  async function initContract() {
    if(!window.ethereum) return { error: 'no wallet' };

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    cityContract = new ethers.Contract(cityContractAddress, CityContract.abi, signer);
  }
  
  const getNftList = async () => {
    let account = window.ethereum.selectedAddress; // bira se trenutna adresa ili null ako nije connectovan korisnik
    if(!account){
      [account] = await window.ethereum.request({ method: 'eth_requestAccounts' }); // poziva se funkcija za connectovanje korisnika
    }   
    let addr = account;
    console.log(addr);

    if(!cityContract) {
      await initContract();
    }

    let numOfNFTs = await cityContract.balanceOf(addr);
    numOfNFTs = numOfNFTs.toNumber();
    let list = Array(numOfNFTs).fill(0);
    let id;
    for(let i = 0; i < numOfNFTs; i++) {
        id = await cityContract.tokenOfOwnerByIndex(addr, i);
        id = id.toNumber();
        list[i] = id;
    }
    return list;
  }

  const connectWallet = async () => {
    if(connecting.current) return;
    if(window.ethereum.selectedAddress && nfts.length>0) return;

    connecting.current = true;

    let list = await getNftList();

    connecting.current = false;  
    setNfts(list);
  };

  const initNftList = async () => {
    let list = await getNftList();
    setNfts(list);
  }

  useEffect(() => {
    if(window.ethereum.selectedAddress) { // ako je povezana neka adrese onda se ucitavaju podaci za nftove
      initNftList();
    }
  }, []);

  return (
    <>
      <title>Leaderboard</title>
      <Nav connectWallet={connectWallet} /> {/* Ovo treba da bude drugaciji navigation bar */}
      <div className={styles.leaderboard}>
        <div>
          <h1>Leaderboard</h1>
          <LeaderboardList nfts={nfts} />
        </div>
      </div>
    </>
  )
}

export default leaderboard