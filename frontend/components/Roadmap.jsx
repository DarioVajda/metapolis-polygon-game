import React from 'react'

import styles from './styles/roadmap.module.css';

import RoadmapItem from './RoadmapItem';

const Roadmap = () => {

  let items = [
    {date: '!!!', title: 'TODO LISTA', description: 'OD SAD OVDE PISEM STA TREBAM DA URADIM, OVA LISTA SE NALAZI U "components\\Roadmap.jsx" FAJLU'},
    {date: 'STO PRE', title: 'TODO', description: 'TREBA STAVITI THREE.JS CANVAS U DIV I CENTRIRATI TAJ CANVAS PO VISINI I ONDA CE UVEK BITI U CENTRU KAD SE MENJA VELICINA EKRANA'},
    {date: 'STO PRE', title: 'TODO', description: 'TREBA PROMENITI DA SE KOD MINTOVANJA POZOVE FUNKCIJA ZA ODGOVARAJUCI BROJ NFT-OVA'},
    {date: 'STO PRE', title: 'TODO', description: 'TREBA NAPRAVITI ANIMACIJU ZA FAQs DEO KAD SE POJAVLJUJE ODGOVOR'},
    {date: 'May 18th', title: 'Mint period end', description: 'Minting is publicly available until this date for 0.1 WETH per NFT (or the appropriate price in MATIC)'},
    {date: 'May 22th', title: 'Game start', description: 'The game officially starts and everyone may start building and upgrading their city'},
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