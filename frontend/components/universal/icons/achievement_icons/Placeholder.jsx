import React from 'react'

import AchievementFrame from './AchievementFrame';

const Placeholder = ({ size, unit }) => {
  
	const wh = `${size>0?size:1}${unit?unit:'em'}`; // Width and Height
	console.log(wh);

  const childStyle = { gridColumn: 1, gridRow: 1 }

	// <svg width={wh} height={wh} viewBox="0 0 32 32" style={{...childStyle, transform: 'scale(0.68) translateY(-15%)'}} >
  return (
		<AchievementFrame wh={wh} backgroundColor='var(--light-text)' />
	)
}

export default Placeholder