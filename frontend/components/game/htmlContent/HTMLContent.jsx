import React from 'react'

import styles from './htmlContent.module.css';

import Hover from '../../universal/hover/Hover';

const HTMLContent = () => {
  return (
    <div className={styles.contentWrapper}>

      <div className={styles.topData}>
        <Hover info='Money' underneath={true} childWidth='10em' specialId='Money' sidePadding='0.5em' >
          <div className={styles.topDataElement}>Money</div>
        </Hover>
        <Hover info='Income' underneath={true} childWidth='10em' specialId='Income' sidePadding='0.5em' >
          <div className={styles.topDataElement}>Income</div>
        </Hover>
        <Hover info='Educated' underneath={true} childWidth='10em' specialId='Educated' sidePadding='0.5em' >
          <div className={styles.topDataElement}>Educated</div>
        </Hover>
        <Hover info='Uneducated' underneath={true} childWidth='10em' specialId='Uneducated' sidePadding='0.5em' >
          <div className={styles.topDataElement}>Uneducated</div>
        </Hover>
        <div>Time until next income</div>
      </div>
      <div>
        <div>normal buildings</div>
        <div>special buildings</div>
      </div>

      {/* <button onClick={() => console.log('button click')}>Dugme</button> */}
    </div>
  )
}

export default HTMLContent