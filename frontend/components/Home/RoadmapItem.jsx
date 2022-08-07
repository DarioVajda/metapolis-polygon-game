import React from 'react'

import styles from '../styles/roadmap.module.css';

const RoadmapItem = ({data}) => {
  const inPast = () => {
    let d = new Date();
    let unix = d.getTime() / 1000;
    // console.log(unix, data.unix);
    // console.log(unix > data.unix);
    return unix > data.unix;
  }

  return (
    <div className={styles.item}>
      <div className={`${styles.leftLine} ${inPast() && styles.inPastLine}`} style={{ zIndex: data.index }}/>
      <div className={`${styles.circle} ${inPast() && styles.inPastCircle}`}>
        {data.date}
      </div>
      <div>
        <div className={styles.title}>
          {data.title}
        </div>
        <div className={styles.description}>
          {data.description}
        </div>
      </div>
    </div>
  )
}

export default RoadmapItem