import React from 'react'

import styles from './styles/prizes.module.css';

const Prizes = () => {
  return (
    <div className={styles.prizes}>
      <h1>
        Prizes
      </h1>
      <p>
        Every week there will be some players eliminated from this competition. If you get to the next week, you progress to the next prize tier. The more people participate, the bigger the prize pool for the winners! ...
      </p>
      <div>
        here will be the current pool, and a progress bar with info about the next prize pool, also there could be a popup with info about every stage of the prize pool, determined by the number of NFTs minted...
      </div>
    </div>
  )
}

export default Prizes