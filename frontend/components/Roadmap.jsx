import React from 'react'

import styles from './styles/roadmap.module.css';

import RoadmapItem from './RoadmapItem';

const Roadmap = () => {
  
  let items = [
    {unix: 0, date: 'STO PRE', title: 'TODO', description: 'Trebam da osmislim deo sajta koji objasnjava nagrade (skica) i da ga napravim.'},
    {unix: 0, date: 'STO PRE', title: 'TODO', description: 'MOZDA BI TREBALO DA SE NAPRAVI DA SE SNAPUJE EKRAN KOD WALKTHROUGH DELA NA SREDINU KAO'},
    {unix: 0, date: 'STO PRE', title: 'TODO', description: 'MOGAO BIH DA NAPRAVIM DA SE I BOJA DUGMETA I SLIDERA MENJAJU U ZAVISNOSTI OD IZABRANOG TOKENA'},
    {unix: 0, date: 'STO PRE', title: 'TODO', description: 'MOZDA DA SE NAPRAVI DOLE ZAGLAVLJE SA JOS NEKIM PODACIMA, TIPA BIZNIS MEJL I SLICNO, MADA MOZDA JE TO NEPOTREBNO U OVOJ SITUACIJI'},
    {unix: 0, date: 'May 18th', title: 'Mint period end', description: 'Minting is publicly available until this date for 0.1 WETH per NFT (or the appropriate price in MATIC)'},
    {unix: 1652875200, date: 'May 18th', title: 'Mint period end', description: 'Minting is publicly available until this date for 0.1 WETH per NFT (or the appropriate price in MATIC)'},
    {unix: 1653393600, date: 'May 22th', title: 'Game start', description: 'The game officially starts and everyone may start building and upgrading their city'},
  ];
  
  return (
    <div className={styles.wrapper}>
      <h1>Roadmap</h1>
      <div className={styles.roadmap}>
        {/* <div className={styles.leftLine} /> */}
        <div className={styles.list}>
          {
            items.map((item, index) => (
              <div key={index}>
              <RoadmapItem data={{...item, index: 30-index}} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Roadmap