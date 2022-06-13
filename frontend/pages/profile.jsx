import React, { useEffect, useState } from 'react'
import Head from 'next/head';

import Profile from '../components/Profile/Profile';
import ConnectWallet from '../components/Profile/ConnectWallet';
import Nav from '../components/Nav';

const profile = () => {
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

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <main>
        <Nav />
        {
          addr === 0 ?
          <ConnectWallet connectUser={connectUser} /> :
          <Profile addr={addr} isOwner={true} />
        }
      </main>
    </div>
  )
}

export default profile