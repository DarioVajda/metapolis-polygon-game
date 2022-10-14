import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';

import LeaderboardItem from './LeaderboardItem';
import Separator from './Separator';

import { prizes, getRange, price } from '../utils/prizes';
import { specialTypes } from '../../../server/gameplay/building_stats';

import style from './leaderboard.module.css';

const LeaderboardList = ({nfts}) => {
  const [list, setList] = useState(false); // false - not loaded, [...] - list of nfts
  const [specialTypeData, setSpecialTypeData] = useState({});
  const loaded = useRef(0);
  
  const [expanded, setExpanded] = useState(-1);

  const expand = (i) => {
    setExpanded(expanded===i?-1:i);
  }

  // #region loading the data

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const getList = async () => {
    let res = await (await fetch('http://localhost:8000/leaderboard')).json();
    // console.log(res);
    setList(res.map(element => element.id)); // sets the city list to an array with IDs sorted by their score
  }

  const loadCity = async (id, index) => {
    // treba da proveri koja je poslednja vrednost u listi koja je ucitana
    // ako je ucitano sve pre ovog grada onda se ucitava ovaj i oznacava se ucitanim na kraju
    // u suprotnom se ceka dok se ne ucita ostalo (ovo bas i ne znam kako da uradim)

    
    /* CEKANJE (komentarisano)
    // OVO JE KOMENTARISANO JER DELUJE BOLJE KAD SE NE CEKA, ALI PITANJE JE DA LI JE OVO DOBRO RESENJE U SLUCAJU DA POSTOJI VECI BROJ GRADOVA
    while(loaded.current < index) {
      // console.log('waiting:', index);
      // console.log(loaded.current);
      await delay(index * 50); // da bi se u pocetku na vreme ucitalo sve, a kasnije ce se oni gradovi dole dovoljno brzo ucitati
    }
    */


    let data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    loaded.current = index + 1;
    return data;
  }

  const getSpecialTypeData = async () => {
    let data = {};
    const loadType = async (type) => {
      let res = await (await fetch(`http://localhost:8000/specialtype/${type}`)).json();
      data[type] = {
        count: res.count,
        offer: res.offers,
        rarity: res.rarity,
        soldOut: res.soldOut
      };
    }
    Object.values(specialTypes).forEach(element => {
      loadType(element.type);
    })

    while(Object.keys(data).length < Object.keys(specialTypes).length) {
      await delay(50);
    }

    setSpecialTypeData(data);
  }
  
  // #endregion

  useEffect(() => {
    getList();
    getSpecialTypeData();
  }, []);

  const funkcija = (i) => { 
    // funkcija koja vraca podatke o range-u
    let res = getRange(list.length, i);
    return res;
  };

  return (
    <div className={style.leaderboard}>
      {
        list === false ?
        Array(10).fill(0).map((_, i) => (
          <div key={i+10000}>
            <motion.div layout key={i} >
              <LeaderboardItem id={-1} index={i} />
            </motion.div>
          </div>
        )) :
        // staviti broj u Array() koliko puta zelis da se ponovi lista u leaderboard (ovo je samo privremeno, inace treba da bude samo list.map(...))
        Array(1).fill(0).reduce((prev, _) => [...prev, ...list], []).map((element, index) =>
          <div key={index+10000}>
            {
              element !== -1 &&
              <Separator data={funkcija(index+1)} index={index+1} nfts={list.length} price={price} />
            }
            <motion.div layout key={index}>
              <LeaderboardItem 
                id={element} 
                index={index} 
                expanded={index===expanded} 
                loadCity={loadCity} 
                expand={expand}
                owned={nfts.includes(element)}
                nfts={loaded?list.length:0}
                specialTypeData={specialTypeData}
              />  
            </motion.div>
          </div>
        )
      }
    </div>
  )
}

export default LeaderboardList