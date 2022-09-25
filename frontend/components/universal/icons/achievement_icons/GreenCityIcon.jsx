import React from 'react'

import AchievementFrame from './AchievementFrame';

const GreenCityIcon = ({ size, unit, onMouseEnter, onMouseLeave, hoverable }) => {
  
  const wh = `${size>0?size:1}${unit?unit:'em'}`; // Width and Height

  const childStyle = { gridColumn: 1, gridRow: 1 }

  return (
    <AchievementFrame hoverable={hoverable} size={size} unit={unit} backgroundColor='lightgreen' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
      <svg width={wh} height={wh} viewBox="0 0 64 64" style={{...childStyle, transform: 'scale(0.68) translateY(-15%)'}} >
        <path fill="#947151" d="M25 52.1h14V64H25z"/>
        <path fill="#71a03a" d="M32 34.9L2 55.1s14.5 3.4 30 3.4s30-3.4 30-3.4L32 34.9z"/>
        <path fill="#76aa3f" d="M32 23.6L7 43.8s12.1 3.4 25 3.4s25-3.4 25-3.4L32 23.6z"/>
        <path fill="#7cb545" d="M32 12.3L12 32.5s9.7 3.4 20 3.4s20-3.4 20-3.4L32 12.3z"/>
        <path fill="#83bf4f" d="M32 1L17 20.8s7.2 3.8 15 3.8s15-3.8 15-3.8L32 1z"/>
      </svg>
    </AchievementFrame>
  )
}

export default GreenCityIcon