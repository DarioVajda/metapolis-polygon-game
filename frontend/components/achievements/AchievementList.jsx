import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import { motion } from 'framer-motion'

import AchievementItem from './AchievementItem';
import XIcon from '../universal/icons/XIcon';

import styles from './achievements.module.css';
import { achievements, rewardTypes } from './achievements';
import { useBuildingStore } from '../game/BuildingStore';

const AchievementList = ({ id, city, closePopup, data, saveData }) => {

  const dynamicData = useBuildingStore(state => state.dynamicData);
  const staticData = useBuildingStore(state => state.staticData);
  const buildings = useBuildingStore(state => state.buildings);
  const specialBuildings = useBuildingStore(state => state.specialBuildings);
  const numOfNfts = useBuildingStore(state => state.numOfNfts);

  const completed = useBuildingStore(state => state.completed);

  useEffect(() => {
    // return;
    let isMounted = true;

    const loadData = async () => {

      if(data) return; // podaci su vec ucitani

      let list = undefined;
      let count = undefined;
      let cityData = undefined;
  
      // #region loading functions
      const loadList = async () => {
        // let res = await (await fetch(`https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/cities/${id}/achievements`)).json();
        let res = dynamicData.achievementList;
        list = [ ...res ];
        console.log({list});
      }
    
      const loadNumOfNfts = async () => {
        // let res = await (await fetch('https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/count')).json();
        let res = numOfNfts;
        count = res;
        console.log({count});
      }
    
      const loadCity = async () => {
        // proverava se da li su poslati podaci o gradu kao argument
        if(city) {
          cityData = city;
        }
    
        // podaci o gradu se ucitavaju ako nisu poslati
        // let res = await (await fetch(`https://dariovajda-bookish-winner-49j59r546w43jg4-8000.preview.app.github.dev/cities/${id}/data`)).json();
        let res = {
          ...staticData,
          ...dynamicData,
          buildings,
          specialBuildings
        }
        cityData = res;
        console.log({cityData});
      }
      // #endregion
      
      loadList();
      loadNumOfNfts();
      loadCity();
  
      const delay = async (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
      }
  
      while(list === undefined || count === undefined || cityData === undefined) {
        await delay(20);
      }

      list = list.map(element => ({ ...element, ...achievements[element.key] }) );
      list = list.map(element => ({ ...element, check: element.checkFunction(cityData) }) );

      list = [
        ...list.filter((element) => element.count < Math.ceil(count * element.percentage) && element.check.completed === true ),
        ...list.filter((element) => element.count < Math.ceil(count * element.percentage) && element.check.completed === false).sort((a, b) => b.check.value - a.check.value),
        ...list.filter((element) => element.count === Math.ceil(count * element.percentage) && element.check.completed === true),
        ...list.filter((element) => element.count === Math.ceil(count * element.percentage) && element.check.completed === false)
      ]

      // console.log(list);
  
      console.log({ list: list, count: count, city: cityData });
      if(isMounted === true) saveData({ list: list, count: count, city: cityData });
    }

    loadData();

    return () => {
      isMounted = false;
    }
  }, [ dynamicData, buildings, specialBuildings, numOfNfts ]);

  const claimReward = (key) => {

    /* old version

    let list = [ ...data.list ];
    let index = list.reduce((prev, curr, index) => prev === -1 && curr.key === key ? index : prev, -1);

    // console.log(index); return;

    let cityData = data.city;
    let achievement = list[index];

    // console.log({list});

    let reward = { value: achievement.rewardValue, type: achievement.rewardType };
    cityData = rewardTypes[reward.type].preview(cityData, reward.value);
    // poziva se funkcija koja dodaje ovo na listu instrukcija ili odmah cuva na serveru...

    // console.log(list[index]);
    
    list[index].count++;
    list[index].completed = true;
    list[index].check = {
      completed: true,
      main: '',
      message: '',
      value: 1
    }
    list = list.map(element => ({ ...element, check: element.checkFunction(cityData) }) );
    
    saveData({ list: list, count: data.count, city: cityData });

    */

    completed(key, data.city, data.list);
  }

  console.log(data);

  return (
    <>
      <div className={styles.topWrapper}>
        <div className={styles.top}>
          <span>Achievements</span>
          <XIcon size={1} onClick={closePopup} />
        </div>
      </div>
      {
        data === false ?
        <div className={styles.achievementList} >
          {
            Object.keys(achievements).map((element, index) => ( 
              <motion.div layout key={element} style={{ backgroundColor: 'transparent' }} >
                <AchievementItem />
              </motion.div>
            ))
          }
        </div> :
        <div className={styles.achievementList} >
        {
          [
            ...data.list.filter((element) => element.count < Math.ceil(data.count * element.percentage) && element.check.completed === true ),
            ...data.list.filter((element) => element.count < Math.ceil(data.count * element.percentage) && element.check.completed === false).sort((a, b) => b.check.value - a.check.value),
            ...data.list.filter((element) => element.count === Math.ceil(data.count * element.percentage) && element.completed === true),
            ...data.list.filter((element) => element.count === Math.ceil(data.count * element.percentage) && element.completed === false)
          ].map((item, index) => (
            <motion.div layout key={item.key} style={{ backgroundColor: 'transparent' }} >
              <AchievementItem data={item} count={data.count} claimReward={() => { claimReward(item.key) }} />
            </motion.div>
          ))
        }
        </div>
      }
    </>
  )
}

export default AchievementList