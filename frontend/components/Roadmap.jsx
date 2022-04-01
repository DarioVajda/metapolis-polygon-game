import React from 'react'

import styles from './styles/roadmap.module.css';

import RoadmapItem from './RoadmapItem';

const Roadmap = () => {
  
  let items = [
    {date: '!!!', title: 'TODO LISTA', description: 'OD SAD OVDE PISEM STA TREBAM DA URADIM, OVA LISTA SE NALAZI U "components\\Roadmap.jsx" FAJLU'},
    {date: 'STO PRE', title: 'TODO', description: 'MOZDA DA SE NAPRAVI DOLE ZAGLAVLJE SA JOS NEKIM PODACIMA, TIPA BIZNIS MEJL I SLICNO, MADA MOZDA JE TO NEPOTREBNO U OVOJ SITUACIJI'},
    {date: 'STO PRE', title: 'TODO', description: 'TREBA NAPRAVITI ANIMACIJU ZA FAQs DEO KAD SE POJAVLJUJE ODGOVOR'},
    {date: 'STO PRE', title: 'TODO', description: 'MOGAO BIH DA NAPRAVIM DA SE I BOJA DUGMETA I SLIDERA MENJAJU U ZAVISNOSTI OD IZABRANOG TOKENA'},
    {date: 'STO PRE', title: 'TODO', description: 'TREBA NAPRAVITI KOD ROADMAPA DA ONO SA STRANE BUDE LEPSE (DA MENJA BOJE ILI NESTO SLICNO)'},
    {date: 'May 18th', title: 'Mint period end', description: 'Minting is publicly available until this date for 0.1 WETH per NFT (or the appropriate price in MATIC)'},
    {date: 'May 22th', title: 'Game start', description: 'The game officially starts and everyone may start building and upgrading their city'},
    {date: 'NOW', title:'sus', description:'amogus sus gusgus amogus susy baki'},
  ]
  
  return (
    <div className={styles.wrapper}>
      <h1>Roadmap</h1>
      <div className={styles.roadmap}>
        <div className={styles.leftLine} />
        <div className={styles.list}>
          {
            items.map((item, index) => (
              <div key={index}>
              <RoadmapItem data={item} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Roadmap