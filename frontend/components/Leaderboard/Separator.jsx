import React from 'react'

import styles from './separator.module.css'

const Separator = ({ data, index, nfts, price }) => {

  if(index === data.end || index === nfts) return (
    <div className={styles.separator}>
      <div className={styles.arrow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
        </svg>
      </div>
      <div className={styles.text}>
        #{data.start}{data.start!=data.end && `-${data.end}`}
      </div>
      <div className={styles.text}>
        →
      </div>
      <div className={styles.eth}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true" 
          role="img" 
          width="0.62em" 
          height="1em" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox="0 0 256 417"
        >
          <path fill="var(--eth-left2)" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
          <path fill="var(--eth-left1)" d="m.001 212.321l127.96 75.637V154.159z"/>
          <path fill="var(--eth-left2)" d="M127.962 416.905v-104.72L0 236.585z"/>
          <path fill="var(--eth-right2)" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/>
          <path fill="var(--eth-right1)" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/>
          <path fill="var(--eth-right2)" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.601l128.038-180.32z"/>
        </svg>
      <div className={styles.prize}>
        {data.prize*price}
      </div>
      </div>
    </div>
  )
  else return <></>
}

export default Separator