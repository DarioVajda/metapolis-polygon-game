import React, { useEffect, useRef, useState } from 'react'

import { prizes, price } from './utils/prizes';

import styles from '../styles/prizes.module.css';

const PrizesPopup = ({closePopup, cities}) => {

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

    if(_range === -1) _range = 0;
    
    setRange(_range);
  }

  const [range, setRange] = useState(0); // trenutno se ovaj prikazuje na ekranu
  const [stage, setStage] = useState(0); // stage na kojem je mintovanje

  const round = (x) => {
    return Math.round(x*1000)/1000;
  }

  useEffect(() => {
    getRange();
  }, []);

  let totalPrizePool = 0;
  prizes[range].list.forEach((element) => {
    totalPrizePool += (element.end-element.start+1) * element.prize * price;
  });

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
          <h2>
            Total prize pool: {totalPrizePool} ETH
          </h2>
          <div className={styles.prizeTable}>
            {
              prizes[range].list.map((element, index) => (
                <div key={index} className={styles.prizeRange}>
                  <div className={styles.firstColumn}>
                    #{element.start}{element.start!=element.end && `-${element.end}`}
                  </div>
                  <div className={styles.secondColumn}>
                    {round(element.prize * price)} ETH
                  </div>
                </div>
              ))
            }
          </div>
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
        <h3 className={styles.left}>
          {
            stage < prizes.length ?
            (
              stage === 1?
              <>{prizes[stage].min - cities} NFTs left to mint to earn prizes for playing.</> :
              <>{prizes[stage].min - cities} NFTs left to mint to increase the prize pool.</>
            ) :
            <>All NFTs are minted.</>
          }
        </h3>
      </div>
    </div>
  )
}

export default PrizesPopup


/*

kako da se vidi da li osoba poseduje neke nase nftove i koje
poslati marku weth tokene

*/