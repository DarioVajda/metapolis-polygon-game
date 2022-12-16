import React from 'react'

const HomeIcon = ({ size, unit }) => {
  const style = { 
    // transform: `rotateZ(${(direction?direction:0)*90}deg)`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const wh = `${size?size:1}${unit?unit:'em'}`; // Width and Height

  return (
    <div style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width={wh} height={wh} preserveAspectRatio="xMidYMid meet" viewBox="0 0 15 15">
        <path fill="currentColor" d="M7.825.12a.5.5 0 0 0-.65 0L0 6.27v7.23A1.5 1.5 0 0 0 1.5 15h4a.5.5 0 0 0 .5-.5v-3a1.5 1.5 0 0 1 3 0v3a.5.5 0 0 0 .5.5h4a1.5 1.5 0 0 0 1.5-1.5V6.27L7.825.12Z"/>
      </svg>
    </div>
  )
}

export default HomeIcon