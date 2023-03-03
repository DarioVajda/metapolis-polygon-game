import React from 'react'

const MergeIcon = ({ size, unit }) => {
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
        <path fill="currentColor" d="M4 9q-.425 0-.713-.288T3 8V5q0-.825.588-1.413T5 3h3q.425 0 .713.288T9 4q0 .425-.288.713T8 5H5v3q0 .425-.288.713T4 9Zm16 0q-.425 0-.713-.288T19 8V5h-3q-.425 0-.713-.288T15 4q0-.425.288-.713T16 3h3q.825 0 1.413.588T21 5v3q0 .425-.288.713T20 9Zm-3.875 6.125L13.7 12.7q-.3-.3-.3-.7t.3-.7l2.425-2.425q.3-.3.713-.3t.712.3q.3.3.3.713t-.3.712l-.725.7H21q.425 0 .713.288T22 12q0 .425-.288.713T21 13h-4.175l.725.7q.3.3.3.713t-.3.712q-.3.3-.713.3t-.712-.3Zm-9.65 0q-.3-.3-.313-.713t.288-.712l.725-.7H3q-.425 0-.713-.288T2 12q0-.425.288-.713T3 11h4.175l-.725-.7q-.3-.3-.288-.713t.313-.712q.3-.3.7-.3t.7.3L10.3 11.3q.3.3.3.7t-.3.7l-2.425 2.425q-.3.3-.7.3t-.7-.3ZM5 21q-.825 0-1.413-.588T3 19v-3q0-.425.288-.713T4 15q.425 0 .713.288T5 16v3h3q.425 0 .713.288T9 20q0 .425-.288.713T8 21H5Zm11 0q-.425 0-.713-.288T15 20q0-.425.288-.713T16 19h3v-3q0-.425.288-.713T20 15q.425 0 .713.288T21 16v3q0 .825-.588 1.413T19 21h-3Z"/>
      </svg>
    </div>
  )
}

export default MergeIcon