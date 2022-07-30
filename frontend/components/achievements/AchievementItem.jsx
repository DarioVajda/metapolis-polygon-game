import React, { createRef } from 'react'
import { useEffect, useState } from 'react';

// import { achievements } from './achievements.jsx';
// import { achievements } from '../../../server/blockchain_api/achievements'; // uspeo sam da importujem node fajl u frontend (ne znam kako to da ovo radi)

import EthIcon from '../universal/icons/EthIcon';
import MaticIcon from '../universal/icons/MaticIcon';
import MoneyIcon from '../universal/icons/MoneyIcon';
import IncomeIcon from '../universal/icons/IncomeIcon';
import EducatedBoostIcon from '../universal/icons/EducatedBoostIcon';

import Placeholder from '../universal/icons/achievement_icons/Placeholder';

import ProgressBar from '../universal/progress_bar/ProgressBar.jsx';
import Hover from '../universal/hover/Hover.jsx';

import styles from './achievements.module.css';
import { useRef } from 'react';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// INSPIRATION: https://cdn.elearningindustry.com/wp-content/uploads/2018/08/elearning-gamification.png
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const AchievementItem = ({ data, count, claimReward }) => {

  const getProgressColor = (value) => {
    if(value > 0.8) {
      return 'green';
    }
    else if(value > 0.4) {
      return 'yellow';
    }
    else {
      return 'red'
    }
  }

  // const [achievement, setAchievement] = useState(data);
  let achievement = data;
  // const [check, setCheck] = useState(achievement.check);
  let check = achievement.check;
  // const [progressColor, setProgressColor] = useState(getProgressColor(check.value));
  let progressColor = getProgressColor(check.value);
  // const [completedColor, setCompletedColor] = useState(achievement.count / Math.ceil(count * achievement.percentage) === 1 ? 'red' : 'blue');
  let completedColor = achievement.count / Math.ceil(count * achievement.percentage) === 1 ? 'red' : 'blue';

  const rewardIcons = useRef({
    'eth': <EthIcon />,
    'matic': <MaticIcon />,
    'money': <MoneyIcon />,
    'boost': <IncomeIcon />,
    'extraEducated': <EducatedBoostIcon />
  });

  let completedPercentage = achievement.count / Math.ceil(count * achievement.percentage);

  useEffect(() => {
    // let progress = getProgressColor(check.value);
    // if(progressColor !== progress) setProgressColor(progress);

    // let completed = achievement.count / Math.ceil(count * achievement.percentage) === 1 ? 'red' : 'blue';
    // if(completedColor !== completed) setCompletedColor(completed);
  });

  // console.log(progressColor);
  // console.log({achievement, city, check});
  // console.log(Math.ceil(count * achievement.percentage));
  // console.log(achievement.completed ? 'transparent' : progressColor);

  let itemStyle = {
    opacity: completedPercentage === 1 ? 0.6 : 1, 
    transform: `scale(${completedPercentage === 1 ? 0.97 : 1})`
  }

  // console.log(achievement.key, achievement);

  return (
    <div className={styles.achievementItem} style={itemStyle} >
      <div className={styles.badge} >
        <Placeholder size={100} unit={'%'} />
      </div>
      <div className={styles.info} >
        <div className={styles.topData}>
          <div className={styles.title} >
            {achievement.title}
          </div>
          <div className={styles.prize}>
            {rewardIcons.current[achievement.rewardType]}
            <span>{achievement.rewardValueJsx}</span>
          </div>
        </div>
        <div className={styles.explanation}>
          {achievement.explanation}
        </div>
        <div className={styles.bars}>
          {
            ( completedPercentage < 1 || achievement.completed === true ) &&
            <Hover info={check.completed || achievement.completed ? '' : check.message} >
              <ProgressBar
                fill={check.value} 
                width={100} 
                widthUnit={'%'} 
                height={check.completed && achievement.completed === false ? 2 : 1.5} 
                heightUnit={'em'} 
                bgColor={'var(--lightest-background)'} 
                fillColor={achievement.completed ? 'transparent' : progressColor} 
                // style={ check.completed && achievement.completed === false ? { border: '1px solid var(--light-text)' } : { border: '1px solid transparent'} } 
              >
                {
                  check.completed === false || achievement.completed === true ?
                  <span style={{ fontSize: '1rem', margin: '0 0.5em', alignSelf: 'flex-end' }}>
                    { achievement.completed ? 'Reward claimed.' : check.main }
                  </span> :
                  <div className={styles.claimButton} onClick={claimReward} >
                    <span style={{flexGrow: 1, fontWeight: 600 }}>
                      Claim reward
                    </span>
                  </div>
                }
              </ProgressBar>
            </Hover>
          }
          <ProgressBar 
            fill={completedPercentage} 
            width={completedPercentage < 1 || achievement.completed === true ? 10 : 13} 
            widthUnit={'em'} 
            height={1.5} 
            heightUnit={'em'} 
            bgColor={'var(--lightest-background)'} 
            fillColor={completedColor}
          >
            <span style={{fontSize: '1rem', margin: '0 0.5em', alignSelf: 'flex-end'}}>
              { completedPercentage < 1 || achievement.completed === true ? '' : 'Too late!' } Completed: {achievement.count}/{Math.ceil(count * achievement.percentage)}
            </span>
          </ProgressBar>
        </div>
      </div>
    </div>
  )
}

export default AchievementItem