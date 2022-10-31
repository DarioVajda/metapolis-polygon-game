import React from 'react'

const ArrowIcon2 = ({ size, unit, direction }) => {
  // direction - 0->up, 1->right, 2->down, 3->left

  const style = { 
    transform: `rotateZ(${(direction?direction:0)*90}deg)`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const wh = `${size?size:1}${unit?unit:'em'}`; // Width and Height

  return (
    <div style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width={wh} height={wh} viewBox="0 0 20 20">
        <path fill="currentColor" d="M10 2.5L16.5 9H13v8H7V9H3.5L10 2.5z"/>
      </svg>
    </div>
  )
}

export default ArrowIcon2