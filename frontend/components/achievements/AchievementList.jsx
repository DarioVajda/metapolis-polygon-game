import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import { motion } from 'framer-motion'

import AchievementItem from './AchievementItem';
import XIcon from '../universal/icons/XIcon';

import styles from './achievements.module.css';
import { achievements, rewardTypes } from './achievements';

const AchievementList = ({ id, city, closePopup, data, saveData }) => {

  useEffect(() => {

    let isMounted = true;

    const loadData = async () => {

      if(data) return; // podaci su vec ucitani

      let list = undefined;
      let count = undefined;
      let cityData = undefined;
  
      // #region loading functions
      const loadList = async () => {
        let res = await (await fetch(`http://localhost:8000/cities/${id}/achievements`)).json();
        list = [ ...res ];
      }
    
      const loadNumOfNfts = async () => {
        let res = await (await fetch('http://localhost:8000/count')).json();
        count = res.count;
      }
    
      const loadCity = async () => {
        // proverava se da li su poslati podaci o gradu kao argument
        if(city) {
          cityData = city;
        }
    
        // podaci o gradu se ucitavaju ako nisu poslati
        let res = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
        cityData = res;
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
  
      if(isMounted === true) saveData({ list: list, count: count, city: cityData });
    }

    loadData();

    return () => {
      isMounted = false;
    }
  }, []);

  const claimReward = (key) => {
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
  }

  // console.log(data);

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
        <div>Loading screen</div> :
        <div className={styles.achievementList} >
        {
          [
            ...data.list.filter((element) => element.count < Math.ceil(data.count * element.percentage) && element.check.completed === true ),
            ...data.list.filter((element) => element.count < Math.ceil(data.count * element.percentage) && element.check.completed === false).sort((a, b) => b.check.value - a.check.value),
            ...data.list.filter((element) => element.count === Math.ceil(data.count * element.percentage) && element.completed === true),
            ...data.list.filter((element) => element.count === Math.ceil(data.count * element.percentage) && element.completed === false)
          ].map((item, index) => (
            <motion.div layout key={item.key} style={{ backgroundColor: 'transparent' }} >
              <AchievementItem data={item} index={index} count={data.count} city={data.city} claimReward={() => { claimReward(item.key) }} />
            </motion.div>
          ))
        }
        </div>
      }
    </>
  )

}

export default AchievementList