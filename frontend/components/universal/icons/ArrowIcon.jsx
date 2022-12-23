import React from 'react'

const ArrowIcon = ({ size, unit, direction, verticalFlip }) => {
  // direction - 0->up, 1->right, 2->down, 3->left

  const style = { 
    transform: !verticalFlip ? `rotateZ(${(direction?direction:0)*90+180}deg)` : `rotateX(${direction===0?180:0}deg)`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: !verticalFlip ? '' : 'transform .3s ease-in-out',
  };

  const wh = `${size?size:1}${unit?unit:'em'}`; // Width and Height

  return (
    <div style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width={wh} height={wh} viewBox="0 0 24 24">
        <path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"/>
      </svg>
    </div>
  )
}

export default ArrowIcon