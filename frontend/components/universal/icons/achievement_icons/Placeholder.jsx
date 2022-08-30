import React from 'react'

import AchievementFrame from './AchievementFrame';

const Placeholder = ({ size, unit }) => {
  
  const wh = `${size>0?size:1}${unit?unit:'em'}`; // Width and Height

  const childStyle = { gridColumn: 1, gridRow: 1 }

  return (
    <AchievementFrame wh={wh} backgroundColor='var(--light-text)' />
  )
}

export default Placeholder