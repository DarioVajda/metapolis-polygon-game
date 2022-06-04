import React from 'react'

import styles from './profile.module.css'

const City = ({ id }) => {
  return (
    <div className={styles.nftitem}>
      <div className={styles.city}>
        city
      </div>
      <div className={styles.citydata}>
        City #{id}
      </div>
    </div>
  )
}

export default City