import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import Profile from '../../components/Profile/Profile';

import Head from 'next/head';
import Nav from '../../components/Nav';

const profile = () => {
  const router = useRouter();
  const route = router.query;
  
  // #region checking if it is the connected address

  const [connectedAddr, setConnectedAddr] = useState(0); // adresa od osobe koja je usla u sajt ako je ulogovan
  // false - not loaded, 0 - no one is connected, 0x... - address of the user

  const getConnectedUser = async () => {
    let account = window.ethereum.selectedAddress; // bira se trenutna adresa ili null ako nije connectovan korisnik
    if(!account){
      return;
    }
    setConnectedAddr(account);
  }

  const connectUser = async () => {
    [account] = await window.ethereum.request({ method: 'eth_requestAccounts' }); // poziva se funkcija za connectovanje korisnika
    setConnectedAddr(account);
  }

  useEffect(() => {
    getConnectedUser();
  }, []);

  // #endregion

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <main>
        <Nav />
        {
          !route.addr || !connectedAddr ?
          <>Loading address...</> :
          <Profile addr={route.addr} isOwner={connectedAddr.toLowerCase() === route.addr.toLowerCase()} />
        }
      </main>
    </div>
  )

  
}

export default profile