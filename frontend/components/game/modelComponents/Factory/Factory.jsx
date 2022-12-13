import React from 'react'
import { forwardRef } from 'react'

import Theme0 from './Theme0'

const Factory = forwardRef(({ theme, ...arg}, ref) => {

  // defaul theme
  if(theme === 0) return (
    <Theme0 {...arg} ref={ref} />
  )

  // other cases (will be added later when new models are added)
  else return (
    <Theme0 {...arg} ref={ref} />
  )
})

export default Factory