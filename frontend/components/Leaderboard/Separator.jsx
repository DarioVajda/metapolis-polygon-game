import React from 'react'

import styles from './separator.module.css'

import EthIcon from '../universal/icons/EthIcon';
import ArrowIcon from '../universal/icons/ArrowIcon';

const Separator = ({ data, index, nfts, price, mini, end, func }) => {

  // console.log(data, index, nfts, price);

  if(end) {
    if(func) func();
    
    return (
      <div className={`${styles.separator} ${mini?styles.miniSeparator:''}`}>
        <ArrowIcon size={1.75} direction={2} />
        <div className={styles.text}>
          #{data.end+1}-
        </div>
        <div className={styles.text}>
          No reward.
        </div>
      </div>
    )
  }
  if(index === data.start /* || index === nfts */) {
    if(func) func();
    
    return (
      <div className={`${styles.separator} ${mini?styles.miniSeparator:''}`}>
        <ArrowIcon size={1.75} direction={2} />
        <div className={styles.text}>
          #{data.start}{data.start!=data.end && `-${data.end}`}
        </div>
        <div className={styles.text}>
          →
        </div>
        <div className={styles.eth}>
          <EthIcon height={1.3} />
          <div className={styles.prize}>
            {+(data.prize*price).toFixed(5)}
          </div>
        </div>
      </div>
    )
  }
  else return <></>
}

export default Separator