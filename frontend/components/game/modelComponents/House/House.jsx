import React from 'react'
 

import Theme0 from './Theme0'

const House = ({ theme, reference, ...arg }) => {

  // defaul theme
  if(theme === 0) return (
    <Theme0 {...arg} reference={reference} />
  )

  // other cases (will be added later when new models are added)
  else return (
    <Theme0 {...arg} reference={reference} />
  )
}

export default House