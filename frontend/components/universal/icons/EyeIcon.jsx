import React from 'react'

const EyeIcon = ({ size, unit }) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" width={wh} height={wh} preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/>
      </svg>
    </div>
  )
}

export default EyeIcon