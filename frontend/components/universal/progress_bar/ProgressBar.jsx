import React from 'react'

const ProgressBar = ({ fill, width, widthUnit, height, heightUnit, bgColor, fillColor, children, style, onMouseEnter, onMouseLeave }) => {

  const barStyle = {
    display: 'content',
    backgroundColor: bgColor?bgColor:'var(--light-background)',
    width: `${width?width:10}${widthUnit?widthUnit:'em'}`,
    height: `${height?height:10}${heightUnit?heightUnit:'px'}`,
    borderRadius: `${height?height/2:10/2}${heightUnit?heightUnit:'px'}`,
    overflow: 'hidden',
    cursor: onMouseEnter !== undefined ? 'pointer' : 'default',
    ...style
  }
  
  const fillStyle = {
    backgroundColor: fillColor?fillColor:'var(--text)',
    width: `${Math.floor(100*(fill!==undefined?fill:0.5))}%`,
    height: `${height?height:10}${heightUnit?heightUnit:'px'}`,
    // marginTop: '-1px',
    // marginRight: '-1px',
    borderRadius: ` 0 ${height?height/2:10/2}${heightUnit?heightUnit:'px'} ${height?height/2:10/2}${heightUnit?heightUnit:'px'} 0`,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  }

  const childrenStyle = {
    marginTop: `-${height?height:10}${heightUnit?heightUnit:'px'}`, 
    height: `100%`, 
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }

  return (
    <div style={barStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div style={fillStyle} >
      </div>
      <div style={childrenStyle}>
        <div style={{backgroundColor: 'transparent', lineHeight: `${height?height:10}${heightUnit?heightUnit:'px'}`, flexGrow: 1, textAlign: 'center'}}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar