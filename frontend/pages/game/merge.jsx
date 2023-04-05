import React from 'react'
import Head from 'next/head';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import Popup from '../../components/game/popup/Popup';

import MergeUI from '../../components/merge/MergeUI';
import MergeLandscape from '../../components/merge/MergeLandscape';

import ConnectWallet from '../../components/Profile/ConnectWallet';

import styles from '../../components/merge/merge.module.css';

const merge = () => {

  const router = useRouter();
  const route = router.query;

  // #region connected user

  const [addr, setAddr] = useState(0); // adresa od osobe koja je usla u sajt ako je ulogovan

  const getConnectedUser = async () => {
    let account = window.ethereum.selectedAddress; // bira se trenutna adresa ili null ako nije connectovan korisnik
    if(!account){
      return;
    }
    setAddr(account);
  }

  const connectUser = async () => {
    let [account] = await window.ethereum.request({ method: 'eth_requestAccounts' }); // poziva se funkcija za connectovanje korisnika
    setAddr(account);
  }

  useEffect(() => {
    getConnectedUser();
  }, []);

  // #endregion

  return (
    <div>
      <Head>
        <title>Merge Cities</title>
      </Head>
      <main>
        <div className={styles.wrapper} >
          { 
            addr === 0 ?
            <ConnectWallet connectUser={connectUser} onlyPopup /> :
            <></> 
          }
          <MergeLandscape />
          <MergeUI {...route} addr={addr} />
          <Popup />
        </div>
      </main>
    </div>
  )
}

export default merge