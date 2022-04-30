import React, { useEffect, useRef, useState } from 'react'

import styles from './styles/prizes.module.css';

const PrizesPopup = ({closePopup, cities}) => {
  
  const price = 0.1;

  const prizes = [
    {
      min: 100,
      list: [
        { start: 1, end: 1, prize: 10 },
        { start: 2, end: 10, prize: 3 },
        { start: 11, end: 20, prize: 1 }
      ]
    },
    {
      min: 500,
      list: [
        { start: 1, end: 1, prize: 20 },
        { start: 2, end: 20, prize: 5 },
        { start: 21, end: 50, prize: 3 },
        { start: 51, end: 150, prize: 1 }
      ]
    },
    {
      min: 2500,
      list: [
        { start: 1, end: 1, prize: 40 },
        { start: 2, end: 50, prize: 8 },
        { start: 51, end: 100, prize: 5 },
        { start: 101, end: 200, prize: 3 },
        { start: 201, end: 750, prize: 1 }
      ]
    },
    {
      min: 5000,
      list: [
        { start: 1, end: 1, prize: 60 },
        { start: 2, end: 50, prize: 10 },
        { start: 51, end: 100, prize: 5 },
        { start: 101, end: 200, prize: 2 },
        { start: 201, end: 1500, prize: 1 },
      ]
    },
    {
      min: 10000,
      list: [
        { start: 1, end: 1, prize: 100 },
        { start: 2, end: 50, prize: 20 },
        { start: 51, end: 100, prize: 8 },
        { start: 101, end: 200, prize: 5 },
        { start: 201, end: 1000, prize: 2 },
        { start: 1001, end: 2500, prize: 1 },
      ]
    },
  ];

  const getRange = () => {
    let _range = -1;

    for(let i = 0; i < prizes.length; i++) {
      if(prizes[i].min > cities) {
        break;
      }
      else {
        _range += 1;
      }
    }
    
    setStage(_range + 1);
    console.log(stage);

    if(_range === -1) _range = 0;
    
    setRange(_range);
  }

  const [range, setRange] = useState(0); // treba da se izracuna trenutni range umesto da se inicijalizuje na prvi
  const [stage, setStage] = useState(0);

  const round = (x) => {
    return Math.round(x*1000)/1000;
  }

  useEffect(() => {
    getRange();
  }, []);

  let totalPrizePool = 0;
  prizes[range].list.forEach((element) => {
    totalPrizePool += (element.end-element.start+1) * element.prize * price;
  })

  console.log(`${stage/prizes.length*100}%`);

  return (
    <div className={styles.popup}>
      <div className={styles.window}>
        <div className={styles.top}>
          <h2>
            Prizes
          </h2>
          <div onClick={closePopup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z"/>
            </svg>
          </div>
        </div>
        <div className={styles.content}>
          {
            prizes[range].list.map((element, index) => (
              <div key={index} className={styles.prizeRange}>
                #{element.start}{element.start!=element.end && `-${element.end}`} → {round(element.prize * price)} ETH
              </div>
            ))
          }
          <h2>
            Total prize pool: {totalPrizePool} ETH
          </h2>
        </div>
        <div className={styles.horizontalLine}>
          <div className={styles.completedHorizontalLine} style={{maxWidth: `${stage/prizes.length*100}%`}}></div>
        </div>
        <div className={styles.stages}>
        {
          prizes.map((element, index) => (
            <div key={index} >
              <div
                className={`${index===range?styles.selectedRange:styles.range} ${index<stage&&styles.achivedRange}`}
                onClick={() => setRange(index)}
              >
                {
                  element.min
                }
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default PrizesPopup


/*

kako da se vidi da li osoba poseduje neke nase nftove i koje
poslati marku weth tokene

*/