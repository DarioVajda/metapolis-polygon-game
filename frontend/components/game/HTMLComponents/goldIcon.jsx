import React from 'react'
import styles from '../../styles/game.module.css'
import gold from './gold-128.png'
import Image from 'next/image'

const GoldDiv = (props) => {
  return (
    <div id='income' className={styles.incomeDiv} style={{top:'2%',left:'2%',pointerEvents:'none'}}>
      <div id='textDiv' className={styles.goldTextDiv}>
          Money:
      </div> 
      <div id='goldDiv' className={styles.goldDiv} style={{pointerEvents:'none'}} >
        <div id='goldImgDiv' className={styles.goldImgDiv}>
          <Image src={gold} layout='fill' alt="Gold"/>
        </div>
        <div id='goldAmmountDiv' className={styles.goldAmmountDiv}>
          {props.value}
        </div>
      </div>
    </div>
  )
}

export default GoldDiv