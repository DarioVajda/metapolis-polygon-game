import React from 'react'
import { useState, useEffect } from 'react'

import style from './styles/mintSection.module.css'

const MintSection = ({maticMint, wethMint, numOfNFTs}) => {
  const [citiesLeft, setCitiesLeft] = useState(10000);
  const [num, setNum] = useState(1);
  const [token, setToken] = useState(false); // true-MATIC, false-WETH

  const [price, setPrice] = useState(0);
  
  let mintPressed;

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const getPrice = async (tokenType) => {
    let p;
    await delay(100);
    p = await maticMint(true);
    console.log(p);
    if(p) setPrice(p);
  }

  const mint = async () => {
    if(mintPressed) return;
    
    if(token) {
      mintPressed = true;
      await maticMint();
      mintPressed = false;
    }
    else {
      mintPressed = true;
      await wethMint();
      mintPressed = false;
    }
  }

  const getCitiesLeft = async () => {
    let left = await numOfNFTs();
    setCitiesLeft(10000-left);
  }

  useEffect(() => {
    getPrice(true);
    getCitiesLeft();
  }, []);

  return (
    <div className={style.mintSection}>
      <div className={style.nftsLeft}>Cities left to mint: {citiesLeft}</div>
      <div className={style.mintButton} onClick={() => mint()}>Mint: {num}</div>
      <div className={style.slider}>
        <input type="range" value={num} min="0" max="10" onChange={(e) => { setNum((e.target.value>0)?e.target.value:1);  } } />
      </div>
      <div>
        {token?Math.round(num*price*100)/100:Math.round(num*0.1*100)/100} {token?'MATIC':'WETH'}
      </div>
      <div className={style.tokenChoice}>
        MATIC
        <div className={`${style.switch} ${token?style.switchMatic:style.switchWeth}`} onClick={() => {setToken(!token); }} >
          <div className={`${style.switchCircle} ${token?style.circleMatic:style.circleWeth}`} />
        </div>
        WETH
      </div>
      <div className={style.maxMint}>Max per wallet: 10</div>
      <div className={style.mintEnds}>Minting ends on May 18th at 2pm CET</div>
    </div>
  )
}

export default MintSection