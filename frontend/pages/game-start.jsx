// Ovo je komponenta koja bi trebalo da se prikaze umesto igrice u pocetku kad se otvori /game stranica, omogucava korisniku da izabere jedan od nftova koje ima ako ima

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link';
import { ethers } from 'ethers';

import CityContract from '../../smart_contracts/build/contracts/CityBuilders.json'

import styles from '../components/game/dario/gamestart.module.css'; // ovde ce trebati da se promeni lokacija

import Nav from '../components/Nav';

// ovo nece trebati, napravljeno je kao primer toga kako treba da se koristi komponenta 'GameStart'
const rootComponent = () => {
  const [id, setId] = useState(-1);
  
  return (
    <div>
      {
        id === -1?
        <GameStart setId={setId}/>:
        <div /* nftId={id} */ >
          Ovo je vec napravljena komponenta za igricu i ona kao argument prima id <br />
          ID grada sa kojim osova igra igricu je: {id}
        </div>
      }
    </div>
  )
}

const GameStart = ({ setId }) => {

  // #region getting the nfts the user owns

  const [nfts, setNfts] = useState(-1);

  var cityContract;
  const cityContractAddress = '0x88b68D2926eD258e7988e4D1809c42b199574088';
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
    // console.log(addr);

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

  const setNftList = (_list) => {
    if(_list.length === 1) {
      setId(_list[0]);
      return;
    }

    setNfts(_list);
  }

  const connectWallet = async () => {
    if(connecting.current) return;
    if(window.ethereum.selectedAddress && nfts.length>0) return;

    connecting.current = true;

    let list = await getNftList();

    connecting.current = false;  
    setNftList(list);
  };

  const initNftList = async () => {
    let list = await getNftList();
    setNftList(list);
  }

  useEffect(() => {
    if(window.ethereum.selectedAddress) { // ako je povezana neka adrese onda se ucitavaju podaci za nftove
      console.log('window.ethereum.selectedAddress', window.ethereum.selectedAddress);
      initNftList();
    }
  }, []);

  // #endregion

  console.log(nfts);

  if(nfts === -1) return (
    <div>
      <Nav connectWallet={connectWallet} />
      <div onClick={connectWallet}>
        Connect
      </div>
      <Link href='/'>
        <a>
          Go to Homepage
        </a>
      </Link>
    </div>
  )
  else if(nfts != -1 && nfts.length === 0) return (
    <div>
      It seems like you don't own an NFT to play the game. Go to <Link href='/'>Homepage</Link> to mint your own.
    </div>
  )
  else return (
    <div>
      <Nav connectWallet={connectWallet} />
      <div className={styles.cities}>
        {
          nfts.map((element, index) => (
            <div key={index}>
              {element}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default rootComponent