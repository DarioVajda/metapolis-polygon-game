import React, { useState } from 'react'
import ReactDom from 'react-dom'
import useScrollbarSize from 'react-scrollbar-size';


const PopupModule = ({ children, open, height, width, unit }) => {
  
  const [cash, setCash] = useState(false);

  const scrollBar = useScrollbarSize();

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
    backgroundColor: 'var(--background)',
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

  if(typeof document === 'undefined') {
    return <></>;
  }

  if(!open) {
    document.body.style.overflow = 'visible';
    document.body.style.marginRight = '0';
    return <></>;
  }
  
  document.body.style.overflow = 'hidden';
  document.body.style.marginRight = `${scrollBar.width}px`;

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