import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link';
import useScrollbarSize from 'react-scrollbar-size';

import MintPopup from './MintPopup';

import style from './styles/mintSection.module.css';


const MintSection = ({maticMint, wethMint, networkCheck, numOfNFTs}) => {
  const [citiesLeft, setCitiesLeft] = useState(10000);
  const [num, setNum] = useState(1);
  const [token, setToken] = useState(false); // true-MATIC, false-WETH

  const [price, setPrice] = useState(0); // price of 1 NFT
  const [epsilon, setEpsilon] = useState(0);
  
  const [mintPressed, setMintPressed] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const [error, setError] = useState('');
  
  const scrollBar = useScrollbarSize();

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const showError = async (err) => {
    setError(err);
    await delay(5000);
    setError('');
    // poruke za greske trebaju da budu informativnije i mogla bi da se napravi neka animacija kod prikazivanja greske i da se eventualno stavi neka crvena boja oko dugmeta
  }

  const getPrice = async () => {
    // funkcija koja set-uje cenu u MATICU
    let p;
    await delay(50);
    p = await maticMint(true, 1);
    console.log(p);
    setEpsilon(p.epsilon);
    setPrice(p.maticPrice);
  }

  const openPopup = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.marginRight = `${scrollBar.width}px`;

    setPopupOpen(true);
  }

  const closePopup = () => {
    document.body.style.overflow = 'visible';
    document.body.style.marginRight = '0';

    setPopupOpen(false);
  }

  const mint = async () => {
    if(mintPressed) return;

    if(networkCheck() === false) {
      showError('wrong network');
      return;
    }
    
    let res;
    let func = token?maticMint:wethMint; // bira se odgovarajuci nacin mintovanja

    setMintPressed(true);

    res = await func(false, num);
    if(res.error !== undefined) {
      showError(res.error);
    }
    
    setMintPressed(false);
    closePopup();
  }

  const getCitiesLeft = async () => {
    let left = await numOfNFTs();
    setCitiesLeft(10000-left);
  }

  useEffect(() => {
    getPrice();
    getCitiesLeft();
  }, []);

  return (
    <>
      {
        popupOpen &&
        <MintPopup token={token} closePopup={closePopup} mintFunction={mint} mintPressed={() => mintPressed}/>
      }
      <div className={style.mintSection}>
        <div className={style.nftsLeft}>Cities left to mint: {citiesLeft}</div>
        <button className={style.mintButton} onClick={openPopup}>Mint: {num}</button>
        <div className={style.error}>{error}</div>
        <div className={style.slider}>
          <input type="range" value={num} min="0" max="10" onChange={(e) => { setNum((e.target.value>0)?e.target.value:1);  } } />
        </div>
        <div>
          {token?Math.round((num*price+epsilon)*100)/100:Math.round(num*0.1*100)/100} {token?'MATIC':'WETH'}
        </div>
        <div className={style.tokenChoice}>
          MATIC
          <div className={`${style.switch} ${token?style.switchMatic:style.switchWeth}`} onClick={() => {setToken(!token); }} >
            <div className={`${style.switchCircle} ${token?style.circleMatic:style.circleWeth}`} />
          </div>
          WETH
        </div>
        <p className={style.maxMint}>Max per wallet: 10</p>
        <p className={style.mintEnds}>Minting ends on May 18th at 2pm CET</p>
        <p> 
          Check the following hyperlink for{' '}
          <Link href='/help'><a className={style.help}>HELP</a></Link>
          {' '}with minting
        </p>
      </div>
    </>
  )
}

export default MintSection