import React from 'react'

import styles from './profile.module.css';

import MetamaskIcon from '../universal/MetamaskIcon';
import MetamaskIcon2 from '../universal/MetamaskIcon2';

const ConnectWallet = ({ connectUser }) => {

  return (
    <>
      <div>
        screen that shows when loading the NFTs...
      </div>
      <div className={styles.connectWallet}>
        <MetamaskIcon2 width={20} />
        <div className={styles.connectButton} onClick={connectUser}>
          ConnectWallet 
        </div>
      </div>
    </>
  )
}

export default ConnectWallet