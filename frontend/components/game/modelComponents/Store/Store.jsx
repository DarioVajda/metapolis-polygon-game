import React from 'react'
 
import Theme0Lvl1 from './Theme0-level1'
import Theme1Lvl1 from './Theme1-level1'

const Store = ({ theme, reference, level, ...arg }) => {

  // defaul theme
  if(theme === 0) {
    if(level === 0) 
      return <Theme0Lvl1 {...arg} reference={reference} />
  
    // case of an error!
    else {
      console.log('an error occured while trying to load buildings');
      return null;
    }
  }

  // other cases (will be added later when new models are added)
  else return (
    <Theme1Lvl1 {...arg} reference={reference} />
  )
}

export default Store