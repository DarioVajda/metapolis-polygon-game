import React, { useEffect, useRef, useState } from 'react'

import LeaderboardItem from './LeaderboardItem';

import style from './leaderboard.module.css';

// potencijalne nagrade:
// 1		        10
// 2-5	      	4
// 6-100	    	1
// 101-500		  0.3
// 501-1250	    0.15
// 1251-2500	  0.1

const LeaderboardList = () => {
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
    // await delay(500);
    loaded.current = index + 1;
    return data;
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={style.leaderboard}>
      {
        list.map((element, index) =>
          <div key={index}>
            <LeaderboardItem id={element} index={index} expanded={index===expanded} loadCity={loadCity} expand={expand} />  
          </div>
        )
      }
    </div>
  )
}

export default LeaderboardList