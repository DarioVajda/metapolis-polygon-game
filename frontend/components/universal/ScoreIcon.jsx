import React from 'react'

import styles from './scoreIcon.module.css'

const ScoreIcon = ({ size, unit }) => {

  const divStyle = {
    height: `${size?size:1}${unit?unit:'em'}`,
    width: `${size?size:1}${unit?unit:'em'}`
  }

  return (
    <div className={styles.wrapper} style={divStyle}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="img" 
        width={`${size?size:1}${unit?unit:'em'}`} 
        height={`${size?size:1}${unit?unit:'em'}`} 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 32 32"
      >
        <path fill="currentColor" d="m24 16l-4.6-1.4l2.3-4.3l-4.3 2.3L16 8l-1.4 4.6l-4.3-2.3l2.3 4.3L8 16l4.6 1.4l-2.3 4.3l4.3-2.3L16 24l1.4-4.6l4.3 2.3l-2.3-4.3L24 16z"/>
        <path fill="currentColor" d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14Zm0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4Z"/>
      </svg>
    </div>
  )
}

export default ScoreIcon