import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link';
import useScrollbarSize from 'react-scrollbar-size';

import PrizesPopup from './PrizesPopup';
import MintPopup from './MintPopup';
import EthIcon from './universal/icons/EthIcon';

import style from './styles/mintSection.module.css';


const MintSection = ({maticMint, wethMint, networkCheck, numOfNFTs}) => {
  const [citiesLeft, setCitiesLeft] = useState('');
  const [num, setNum] = useState(1);
  const [token, setToken] = useState(false); // true-MATIC, false-WETH

  const [price, setPrice] = useState(0); // price of 1 NFT
  
  const [mintPressed, setMintPressed] = useState(false);
  const [popupOpen, setPopupOpen] = useState(''); // '', 'mint', 'prizes'

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
    setPrice(p); // p je objekat sa poljima maticPrice i epsilon
  }

  const openPopup = (popup) => {
    if(popup !== 'mint' && popup !== 'prizes') {
      showError('no such popup');
      return;
    }
    document.body.style.overflow = 'hidden';
    document.body.style.marginRight = `${scrollBar.width}px`;

    setPopupOpen(popup);
  }

  const closePopup = () => {
    document.body.style.overflow = 'visible';
    document.body.style.marginRight = '0';

    setPopupOpen('');
  }

  const mint = async () => {
    if(mintPressed) return;

    if(networkCheck() === false) {
      showError('wrong network');
      setMintPressed(false);
      closePopup();
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
        popupOpen==='mint' &&
        <MintPopup token={token} closePopup={closePopup} mintFunction={mint} mintPressed={() => mintPressed}/>
      }
      {
        popupOpen==='prizes' &&
        <PrizesPopup closePopup={closePopup} cities={10000-citiesLeft} />
      }
      <div className={style.wrapper}>
        <h2 className={style.prizes}>
          Compete for a part of the 
          <span className={style.ethSpan} onClick={() => { if(citiesLeft) openPopup('prizes') } } >
            <EthIcon />
            300
          </span>
          prize pool!
        </h2>
        <div className={style.mintSection}>
          <div className={style.nftsLeft}>Cities left to mint: {citiesLeft}</div>
          <button className={style.mintButton} onClick={() => openPopup('mint')}>Mint: {num}</button>
          <div className={style.error}>{error}<br /></div>
          <div className={style.slider}>
            <input type="range" value={num} min="0" max="10" onChange={(e) => { setNum((e.target.value>0)?e.target.value:1);  } } />
          </div>
          <div>
            {token?Math.round((num*price.maticPrice+price.epsilon)*100)/100:Math.round(num*0.1*100)/100} {token?'MATIC':'WETH'}
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
            Check the following link for{' '}
            <Link href='/help'><a className={style.help}>HELP</a></Link>
            {' '}with minting
          </p>
        </div>
      </div>
    </>
  )
}

export default MintSection