import React from 'react'

import styles from './styles/roadmap.module.css';

const RoadmapItem = ({data}) => {
  return (
    <div className={styles.item}>
      <div className={styles.circle}>
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