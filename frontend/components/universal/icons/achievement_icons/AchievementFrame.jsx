import React from 'react'

import styles from './hoverFrame.module.css';

const AchievementFrame = ({ size, unit, backgroundColor, children, onMouseEnter, onMouseLeave, hoverable }) => {
  const style = {
    display: 'grid',
    height: 'fit-content',
    width: 'fit-content',
    backgroundColor: 'transparent'
  }

  const wh = `${size>0?size:1}${unit?unit:'em'}`; // Width and Height

  const childStyle = { gridColumn: 1, gridRow: 1 }

  return (
    <div style={style} className={hoverable?styles.mask:''}>
      { 
        hoverable &&
        <div style={{ height: 0, width: 0, position: 'relative', outline: '5px solid red', bottom: wh, zIndex: 1000 }}>
          <div style={{ width: '20px', height: wh }} />
        </div> 
      }
      <svg width={wh} height={wh} viewBox="0 0 16 16" style={childStyle} >
        <path fill={backgroundColor} d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453a7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625a11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43A62.456 62.456 0 0 1 5.072.56z"/>
      </svg>
      {children}
      <svg width={wh} height={wh} viewBox="0 0 16 16" style={{ ...childStyle, zIndex: 1, cursor: hoverable?'pointer':'default' }} >
        <path fill="var(--light-text)" d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856a.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533c.12.057.218.095.293.118a.55.55 0 0 0 .101.025a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118c.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453a7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625a11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43A62.456 62.456 0 0 1 5.072.56z"/>
        <path className={hoverable?styles.hoverable:styles.hoverable} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} fill='currentColor' d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453a7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625a11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43A62.456 62.456 0 0 1 5.072.56z"/>
      </svg>
    </div>
  )
}

export default AchievementFrame