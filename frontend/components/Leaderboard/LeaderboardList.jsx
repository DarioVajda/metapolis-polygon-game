import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';

import LeaderboardItem from './LeaderboardItem';
import Separator from './Separator';

import ArrowIcon from '../universal/icons/ArrowIcon';

import { prizes, getRange, price } from '../utils/prizes';
import { specialTypes } from '../../../server/gameplay/building_stats';

import style from './leaderboard.module.css';

const UpButton = ({ func }) => {

  const [ active, setActive ] = useState(true);

  useEffect(() => {

    const listenerFunc = () => {
      if(func(true) === false) {
        if(active === false) setActive(true);
      }
      else {
        if(active === true) setActive(false);
      }
    }

    window.addEventListener("scroll", listenerFunc)

    return () => {
      window.removeEventListener("scroll", listenerFunc);
    }
  });

  return (
    <button className={`${style.upButton} ${active===true?style.inactiveButton:''}`} onClick={func}>
      <ArrowIcon direction={0} />
    </button>
  )
}

const DownButton = ({ func }) => {

  const [ active, setActive ] = useState(true);

  useEffect(() => {

    const listenerFunc = () => {
      if(func(true) === false) {
        if(active === false) setActive(true);
      }
      else {
        if(active === true) setActive(false);
      }
    }

    window.addEventListener("scroll", listenerFunc)

    return () => {
      window.removeEventListener("scroll", listenerFunc);
    }
  });

  return (
    <button className={`${style.downButton} ${active===true?style.inactiveButton:''}`} onClick={func}>
      <ArrowIcon direction={2} />
    </button>
  )
}

const LeaderboardList = ({nfts}) => {
  const [list, setList] = useState(false); // false - not loaded, [...] - list of nfts
  const [specialTypeData, setSpecialTypeData] = useState({});
  const loaded = useRef(0);
  const showedThreeDots = useRef(false);

  const MORE_RANGE = 20;
  const [ showingMore, setShowingMore ] = useState();
  
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

    // ovo je privremeno
    res = Array(30).fill(res).reduce((prev, curr) => [...prev, ...curr], []);

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
        offers: res.offers,
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

    // console.log({specialTypeData: data});
    setSpecialTypeData(data);
  }
  
  // #endregion

  useEffect(() => {
    getList();
    getSpecialTypeData();
  }, []);

  const separatorFunction = (i) => { 
    // funkcija koja vraca podatke o range-u
    let res = getRange(list.length, i, false);
    return res;
  };

  // #region manual scrolling
  
  const upButton = (dontScroll) => {
    // let htmlList = document.getElementById('leaderboardList');
    let htmlList = window;
    // console.log(htmlList);

    // this pixel number indicating where the offset between the bottom of the viewport inside div and its top
    let bottom = Math.ceil(htmlList.scrollY - 1); 
    // console.log({ bottom });
    // console.log(document);
    // console.log(window);

    let first;
    for(let i = list.length - 1; i >= 0; i--) {
      let element = document.getElementById(`leaderboardItem${i}`);
      if(!element) continue;
      
      let tempTop = element.offsetTop;
      
      let owned = nfts.includes(list[i]) && i % 50 === 10;
      // console.log(owned);

      // if(owned) console.log({i, tempTop});

      if(tempTop < bottom + element.clientHeight && owned) {
      // if(i === 0) {
        first = i;
        break;
      }
    }

    if(first === undefined) return false;
    if(dontScroll === true) return true;
    
    let tempElement = document.getElementById(`leaderboardItem${first}`);
    // console.log(tempElement);
    // console.log(tempElement.offsetTop);
    // htmlList.scrollTop = tempElement.offsetTop - 4 * tempElement.clientHeight;
    htmlList.scroll({ top: tempElement.offsetTop - 2 * tempElement.clientHeight / 2 });
  }
  
  // treba skontati kako se ove funkcije koriste
  const downButton = (dontScroll) => {
    // let htmlList = document.getElementById('leaderboardList');
    let htmlList = window;
    // console.log(htmlList);

    // this pixel number indicating where the offset between the bottom of the viewport inside div and its top
    let bottom = Math.ceil(htmlList.scrollY + 1); 
    // console.log({ bottom });
    // console.log(document);
    // console.log(window);

    let first;
    for(let i = 0; i < list.length; i++) {
      let element = document.getElementById(`leaderboardItem${i}`);
      if(!element) continue;
      
      let tempTop = element.offsetTop;
      
      let owned = nfts.includes(list[i]) && i % 50 === 10;
      // console.log(owned);

      // if(owned) console.log({i, tempTop});

      if(tempTop > bottom + element.clientHeight && owned) {
      // if(i === 0) {
        first = i;
        break;
      }
    }

    if(first === undefined) return false;
    if(dontScroll === true) return true;
    
    let tempElement = document.getElementById(`leaderboardItem${first}`);
    // console.log(tempElement);
    // console.log(tempElement.offsetTop);
    // htmlList.scrollTop = tempElement.offsetTop - 4 * tempElement.clientHeight;
    htmlList.scroll({ top: tempElement.offsetTop - 2 * tempElement.clientHeight / 2 });
  }

  // #endregion

  // console.log(list);

  return (
    <div className={style.leaderboard} id={`leaderboardList`}>
      <div className={style.first}>
        <UpButton func={upButton} />
      </div>
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
        Array(1).fill(0).reduce((prev, _) => [...prev, ...list], []).map((element, index) => {

          let r = [];
          
          let delta = 1;
          let showingElement = (i) => (
            i < 50 || 
            (list
              .slice(i-delta, i+delta+1)
              .reduce((prev, curr) => prev || nfts.includes(element) === true, false) && (i % 50 === 10-1 || i % 50 === 11-1 || i % 50 === 12-1)) ||
            ( showingMore !== undefined && i >= showingMore && i < showingMore + MORE_RANGE)
          )

          // #region potential three dots

          if(showedThreeDots.current === false && index > 0 && showingElement(index-1) === false) {
            r.push(
              <div key={`threeDots${index}`} className={style.threeDots}>
                <div>
                  <span>
                    ...
                  </span>
                </div>
              </div>
            )
            showedThreeDots.current = true;
          }

          // #endregion

          // #region separator

          let sepData = separatorFunction(index+1);
          if(index + 1 === sepData.start) {
            r.push(
              // <div key={`separator${index}`}>{index}</div>
              <Separator 
                data={sepData} 
                index={index+1} 
                nfts={list.length} 
                price={price} 
                key={`separator${index}`} 
                // func={ shownSeparator }
              />
            );
            showedThreeDots.current = false;
          }
          if(index === sepData.end) {
            r.push(
              <Separator 
                end 
                mini
                data={sepData} 
                key={`endseparator${index}`} 
                // func={ shownSeparator }
              />
            );
            showedThreeDots.current = false;
          }

          // #endregion

          if(showingElement(index)) {
            r.push(
              <motion.div layout key={index} id={`leaderboardItem${index}`} >
                <LeaderboardItem 
                  id={element} 
                  index={index} 
                  expanded={index===expanded} 
                  loadCity={loadCity} 
                  expand={expand}
                  owned={nfts.includes(element) && index % 50 === 10}
                  nfts={loaded?list.length:0}
                  specialTypeData={specialTypeData}
                />  
              </motion.div>
            )
            showedThreeDots.current = false;
          }
          if(!showingElement(index) && showedThreeDots.current === false) {
            r.push(
              <div key={`threeDots${index}`} className={style.threeDots}>
                <div onClick={ () => setShowingMore(index) } >
                  <span>
                    ...
                  </span>
                </div>
              </div>
            )
            showedThreeDots.current = true;
          }

          return r;
        })
      }
      <div className={style.last}>
        <DownButton func={downButton} />
      </div>
    </div>
  )
}

export default LeaderboardList