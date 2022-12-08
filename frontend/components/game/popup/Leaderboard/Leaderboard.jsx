import React from 'react'
import { useEffect } from 'react';
import { motion } from 'framer-motion'

import styles from './leaderboard.module.css';

import XIcon from '../../../universal/icons/XIcon';
import ScoreIcon from '../../../universal/icons/ScoreIcon';
import OpenIcon from '../../../universal/icons/OpenIcon';

const Leaderboard = ({ closePopup, data, saveData }) => {

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {
    (async () => {

      let list = await (await fetch('http://localhost:8000/leaderboard')).json();

      saveData(list);

    })();
  }, [])


  console.log(data);
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Leaderboard
        <XIcon onClick={closePopup} />
      </div>
      <div className={styles.list}>
        <div className={styles.first} />
        {
          data ?
          data.map((element, index) => (
            <motion.div layout key={index} className={styles.city}>
              <span>
                City #{element.id}
              </span> 
              <span>
                <ScoreIcon />{element.score}
              </span>
              <div>
                <a href={`city/${element.id}/preview`} target='/blank'>
                  <OpenIcon />
                </a>
              </div>
            </motion.div>
          )) :
          Array(20)
            .fill(null)
            .map((element, index) => index)
            .sort((a, b) => Math.round(Math.random() * 2 - 1))
            .map((element) => (
            <motion.div layout key={element} className={styles.city}>
              <span>City</span>
              <span><ScoreIcon /></span>
            </motion.div>
          ))
        }
        <div className={styles.last} />
      </div>
    </div>
  )
}

export default Leaderboard