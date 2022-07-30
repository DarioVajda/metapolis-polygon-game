import React from 'react'

const EducatedBoostIcon = ({ size, unit }) => {

  const divStyle = {
    // border: '1px solid white',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const svgStyle = {
    transform: 'scale(1.25)'
  }

  return (
    <div style={divStyle} >
      <svg 
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="img" 
        width={`${size?size:1}${unit?unit:'em'}`}
        height={`${size?size:1}${unit?unit:'em'}`}
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 16 16"
      >
        <path fill="none" stroke="green" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 9.25V6L8 2.75L1.75 6L8 9.25l3.25-1.5v3.5c0 1-1.5 2-3.25 2s-3.25-1-3.25-2v-3.5"/>
      </svg>
    </div>
  )
}

export default EducatedBoostIcon