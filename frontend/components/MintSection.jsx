import React from 'react'
import { useState } from 'react'

import style from './styles/mintSection.module.css'

const MintSection = ({maticMint, wethMint, connectWallet}) => {
  const [citiesLeft, setCitiesLeft] = useState(8342);
  const [num, setNum] = useState(1);

  return (
    <div className={style.mintSection}>
      <div className={style.nftsLeft}>Cities left to mint: {citiesLeft}</div>
      <div>
        Matic
        <input type="range" min="0" max="1" />
        Weth
      </div>
      <div className={style.mintButton} onClick={maticMint}>Mint: {num}</div>
      <div className={style.slider}>
       <input type="range" value={num} min="0" max="10" onChange={(e) => { setNum((e.target.value>0)?e.target.value:1) } } />
      </div>
      <div className={style.maxMint}>Max per wallet: 10</div>
      <div className={style.mintEnds}>Minting ends on May 18th at 2pm CET</div>
    </div>
  )
}

export default MintSection