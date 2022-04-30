import React from 'react'

import Link from 'next/link';
import Head from 'next/head';

import Nav from '../components/Nav'; // trebace da se napravi drugaciji Nav bar za ovu stranicu ali za sad je i ovo ok

import styles from '../styles/help.module.css';

const Help = () => {
  return (
    <>
      <Head>
        <title>City Builder - Mint Tutorial</title>
      </Head>
      <main>
        <Nav />
        <div className={styles.wrapper}>
          <h1 className={styles.title}>
            Mint in 3? easy steps with {' '}
            <div style={{color: "#9900FF"}} className={styles.token}>
              <Link href="#matic">MATIC</Link>
            </div>
            {' '}or Polygon{' '}
            <div style={{color: "#2A6CB8"}} className={styles.token}>
              <Link href="#weth">ETH</Link>
            </div>
          </h1>
          <div id='matic' className={styles.matic}>
            <h1>MATIC</h1>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
            <p>How to mint with the MATIC token...</p>
          </div>
          <div id='weth' className={styles.weth}>
            <h1>ETH</h1>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
            <p>How to mint with the WETH token...</p>
          </div>
          <br />
          <p>asfkdjllksdfaklsafkjasljksfl amogus?</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
          <p>asfkdjllksdfaklsafkjasljksfl</p>
        </div>
      </main>
    </>
  )
}

export default Help