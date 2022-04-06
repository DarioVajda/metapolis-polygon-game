import React from 'react'

import style from './styles/mintPopup.module.css'

const MintPopup = ({token}) => {
  // token: MATIC-true, WETH-false

  return (
    <div className={style.popup}>
      <div className={style.window}>
        <div className={style.top}>
          <h2>WETH mint</h2>
          <div className={style.closeIcon} onClick={() => { console.log('close popup') }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z"/>
            </svg>
          </div>
        </div>
        <div className={style.content}>
          <h3>When minting with Polygon ETH token, there will be 2 transactions:</h3>
          <div className={style.list}>
            <p>1. The first transaction is for preprocessing and getting connected with your Polygon ETH wallet, <span style={{fontWeight: '700'}}>no funds will be sent from it</span>, only the minimal gas fee (≈$0.1) on the polygon network.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
            <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPopup