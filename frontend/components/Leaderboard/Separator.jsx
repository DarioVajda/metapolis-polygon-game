import React from 'react'

import styles from './separator.module.css'

import EthIcon from '../universal/icons/EthIcon';
import ArrowIcon from '../universal/icons/ArrowIcon';

const Separator = ({ data, index, nfts, price }) => {

  // console.log(data, index, nfts, price);

  if(index === data.start /* || index === nfts */) return (
    <div className={styles.separator}>
      <ArrowIcon size={1.75} direction={0} />
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
  else return <></>
}

export default Separator