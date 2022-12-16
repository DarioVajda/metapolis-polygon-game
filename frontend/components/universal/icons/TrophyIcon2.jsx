import React from 'react'

const HomeIcon = ({ size, unit }) => {
  const style = { 
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const wh = `${size?size:1}${unit?unit:'em'}`; // Width and Height

  return (
    <div style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width={wh} height={wh} preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20">
        <path fill="currentColor" d="M15 9a3 3 0 0 0 3-3h2a5 5 0 0 1-5.1 5a5 5 0 0 1-3.9 3.9V17l5 2v1H4v-1l5-2v-2.1A5 5 0 0 1 5.1 11H5a5 5 0 0 1-5-5h2a3 3 0 0 0 3 3V4H2v2H0V2h5V0h10v2h5v4h-2V4h-3v5z"/>
      </svg>
    </div>
  )
}

export default HomeIcon