import React from 'react'

const EthIcon = ({ height, unit }) => {
  return (
    <div style={{backgroundColor: 'transparent'}}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="img" 
        width={`${height?height*0.62:1}${unit?unit:'em'}`} 
        height={`${height?height:1}${unit?unit:'em'}`}
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 256 417"
      >
        <path fill="var(--eth-left2)" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
        <path fill="var(--eth-left1)" d="m.001 212.321l127.96 75.637V154.159z"/>
        <path fill="var(--eth-left2)" d="M127.962 416.905v-104.72L0 236.585z"/>
        <path fill="var(--eth-right2)" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/>
        <path fill="var(--eth-right1)" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/>
        <path fill="var(--eth-right2)" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.601l128.038-180.32z"/>
      </svg>
    </div>
  )
}

export default EthIcon