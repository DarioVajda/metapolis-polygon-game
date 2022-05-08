import React from 'react'
import styles from '../../styles/game.module.css'
import gold from './gold-128.png'
import Image from 'next/image'

const GoldDiv = (props) => {
  return (
    <div id='income' className={styles.dataContainer} style={{top:'2%',left:'2%',pointerEvents:'none'}}>
      <div id='goldtextDiv' className={styles.dataTextDiv}>
          Money:
      </div> 
      <div id='goldDataDiv' className={styles.dataDiv} style={{pointerEvents:'none'}} >
        <div id='goldImgDiv' className={styles.imgDiv}>
          <Image src={gold} layout='fill' alt="Gold"/>
        </div>
        <div id='goldAmmountDiv' className={styles.ammountDiv}>
          {props.value}
        </div>
      </div>
    </div>
  )
}

export default GoldDiv