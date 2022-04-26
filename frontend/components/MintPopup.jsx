import React from 'react'
import { useState } from 'react';

import style from './styles/mintPopup.module.css';

import { SpinnerCircular } from 'spinners-react';

const MintPopup = ({token, closePopup, mintFunction, mintPressed}) => {
  // token: MATIC-true, WETH-false

  const matic = (
    <>
      <h3>When minting with MATIC token, the native token on the Polygon network, there will be only 1 transaction:</h3>
      <div className={style.list}>
        <p>- The minting price is determined by the market price of ETH and MATIC.</p>
      </div>
    </>
  );
  const weth = (
    <>
      <h3>When minting with Polygon ETH token, there will be 2 transactions:</h3>
      <div className={style.list}>
        <p>1. The first transaction is for preprocessing and getting connected with your Polygon ETH wallet, <span style={{fontWeight: '700'}}>no funds will be sent from it</span>, only the minimal gas fee (≈$0.1) on the polygon network. This transaction has to be completed only once per wallet.</p>
        <p>2. The second transation is the one confirming the minting of the NFT, you will be charged the full mint price (0.1 WETH) and you will receive your unique City NFT.</p>
      </div>
    </>
  )

  return (
    <div className={style.popup}>
      <div className={style.window}>
        <div className={style.top}>
          <h2>{token?'MATIC':'WETH'} mint</h2>
          <div className={style.closeIcon} onClick={() => { closePopup(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z"/>
            </svg>
          </div>
        </div>
        <div className={style.content}>
          {token?matic:weth} {/* Ovo je sadrzaj prozora u zavisnosti od toga koji je token selektovan */}
          <div className={style.confirm} onClick={mintFunction}>
            {
              mintPressed() ?
              <SpinnerCircular size='1em' thickness={200} color='#fff' secondaryColor='transparent' /> :
              <svg className={style.spinner} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                <path fill="currentColor" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093l3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            }
            Confirm
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPopup