import React from 'react'

const AddIcon = ({ size, unit }) => {
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
      <svg 
        width={wh} 
        height={wh} 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16v-3h3q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11h-3V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v3H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13h3v3q0 .425.288.713T12 17Zm-7 4q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"/>
      </svg>
    </div>
  )
}

export default AddIcon