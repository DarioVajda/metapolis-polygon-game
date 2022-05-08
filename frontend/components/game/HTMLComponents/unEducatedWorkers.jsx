import React from 'react'
import styles from '../../styles/game.module.css'
import Image from 'next/image'
import uneducatedPerson from './uneducated-person-128.png'

const unEducatedWorkers = (props) => {
  return (
    <div id='uneducatedWorkersContainer' className={styles.dataContainer} style={{top:'2%',left:'22%',pointerEvents:'none'}}>
      <div id='uneducatedWorkerstextDiv' className={styles.dataTextDiv}>
          Uneducated:
      </div> 
      <div id='uneducatedWorkersDataDiv' className={styles.dataDiv} style={{pointerEvents:'none'}} >
        <div id='uneducatedWorkersImgDiv' className={styles.imgDiv}>
          <Image src={uneducatedPerson} layout='fill' alt="UnEducatedWorkers"/>
        </div>
        <div id='uneducatedAmmountDiv' className={styles.ammountDiv}>
          {props.value}
        </div>
      </div>
    </div>
  )
}

export default unEducatedWorkers