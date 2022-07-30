import React, { useState } from 'react'
import ReactDom from 'react-dom'

const PopupModule = ({ children, open, height, width, unit }) => {
  
  const [cash, setCash] = useState(false);
  
  if(!open || typeof document === 'undefined') return <div/>;

  const wrapperStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.384)'
  }

  const parentStyle = {
    border: '1px solid var(--light-text)',
    borderRadius: '20px',
    overflow: 'hidden',
    padding: '0 1em',
    width: `${width?width:60}${unit?unit:'%'}`,
    height: `${height?height:70}${unit?unit:'%'}`,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }

  return ReactDom.createPortal(
    <div style={wrapperStyle} >
      <div style={parentStyle} >
        { React.cloneElement(children, { saveData: setCash, data: cash }) }
      </div>
    </div>,
    document.getElementById('popup')
  )
}

export default PopupModule