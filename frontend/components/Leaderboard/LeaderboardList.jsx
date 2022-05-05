import React, { useEffect, useRef, useState } from 'react'

import LeaderboardItem from './LeaderboardItem';
import Separator from './Separator';

import { prizes, getRange, price } from '../utils/prizes';

import style from './leaderboard.module.css';

const LeaderboardList = ({nfts}) => {
  const [list, setList] = useState(Array(10).fill(-1));
  const loaded = useRef(0);
  
  const [expanded, setExpanded] = useState(-1);

  const expand = (i) => {
    setExpanded(expanded===i?-1:i);
  }

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const getList = async () => {
    let res = await (await fetch('http://localhost:8000/leaderboard')).json();
    setList(res); // sets the city list to an array with IDs sorted by their score
  }

  const loadCity = async (id, index) => {
    // treba da proveri koja je poslednja vrednost u listi koja je ucitana
    // ako je ucitano sve pre ovog grada onda se ucitava ovaj i oznacava se ucitanim na kraju
    // u suprotnom se ceka dok se ne ucita ostalo (ovo bas i ne znam kako da uradim)
    while(loaded.current < index) {
      // console.log('waiting:', index);
      // console.log(loaded.current);
      await delay(index * 50); // da bi se u pocetku na vreme ucitalo sve, a kasnije ce se oni gradovi dole dovoljno brzo ucitati
    }
    let data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    loaded.current = index + 1;
    return data;
  }

  useEffect(() => {
    getList();
  }, []);

  // console.log('nfts:', nfts);
  const funkcija = (i) => { 
    let res = getRange(list.length, i);
    // console.log('res', res);
    return res;
  };

  return (
    <div className={style.leaderboard}>
      {
        list.map((element, index) =>
          <div key={index}>
            <LeaderboardItem 
              id={element} 
              index={index} 
              expanded={index===expanded} 
              loadCity={loadCity} 
              expand={expand}
              owned={nfts.includes(element)}
              nfts={loaded?list.length:0}
              />  
              {
                element !== -1 &&
                <Separator data={funkcija(index+1)} index={index+1} nfts={list.length} price={price} />
              }
              {
                // // temp = getRange(list.length, index) ?
                // (funkcija(index+1).check || index === list.length-1) && element !== -1 ?
                // <>_____________________________________________________________________________</> :
                // <>nothing</>
              }
          </div>
        )
      }
    </div>
  )
}

export default LeaderboardList