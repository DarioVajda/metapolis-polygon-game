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
        <path fill="currentColor" fill-rule="evenodd" d="M19.444 9.361c-.882-4.926-2.854-6.379-3.903-6.379c-1.637 0-2.057 1.217-5.541 1.258c-3.484-.041-3.904-1.258-5.541-1.258c-1.049 0-3.022 1.453-3.904 6.379c-.503 2.812-1.049 7.01.252 7.514c1.619.627 2.168-.941 3.946-2.266C6.558 13.266 7.424 12.95 10 12.95s3.442.316 5.247 1.659c1.778 1.324 2.327 2.893 3.946 2.266c1.301-.504.755-4.701.251-7.514zM6 10a2 2 0 1 1 0-4a2 2 0 0 1 0 4zm7 0a1 1 0 1 1 0-2a1 1 0 1 1 0 2zm2-2a1 1 0 1 1 0-2a1 1 0 1 1 0 2z" clip-rule="evenodd"/>
      </svg>
    </div>
  )
}

export default HomeIcon