import React from 'react'

import AchievementFrame from './AchievementFrame';

const Placeholder = ({ size, unit, onMouseEnter, onMouseLeave, hoverable }) => {
  
  const wh = `${size>0?size:1}${unit?unit:'em'}`; // Width and Height

  const childStyle = { gridColumn: 1, gridRow: 1 }

  return (
    <AchievementFrame hoverable={hoverable} size={size} unit={unit} backgroundColor='var(--light-text)' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
  )
}

export default Placeholder