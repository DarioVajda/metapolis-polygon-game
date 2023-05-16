import React from 'react'
 
import Theme0_2x2 from './Theme0-2x2'
import Theme0_2x3 from './Theme0-2x3'
import Theme0_2x4 from './Theme0-2x4'
import Theme0_2x5 from './Theme0-2x5'
import Theme0_3x3 from './Theme0-3x3'
import Theme0_3x4 from './Theme0-3x4'
import Theme0_3x5 from './Theme0-3x5'
import Theme0_4x4 from './Theme0-4x4'
import Theme0_4x5 from './Theme0-4x5'
import Theme0_5x5 from './Theme0-5x5'

const Park = ({ theme, reference, level, dimensions, ...arg }) => {

  let dim = { x: Math.min(dimensions.x, dimensions.y), y: Math.max(dimensions.x, dimensions.y) };

  // defaul theme
  if(theme === 0) {
    if(dim.x === 2 && dim.y === 2) return <Theme0_2x2 {...arg} reference={reference} />;
    if(dim.x === 2 && dim.y === 3) return <Theme0_2x3 {...arg} reference={reference} />;
    if(dim.x === 2 && dim.y === 4) return <Theme0_2x4 {...arg} reference={reference} />;
    if(dim.x === 2 && dim.y === 5) return <Theme0_2x5 {...arg} reference={reference} />;
    if(dim.x === 3 && dim.y === 3) return <Theme0_3x3 {...arg} reference={reference} />;
    if(dim.x === 3 && dim.y === 4) return <Theme0_3x4 {...arg} reference={reference} />;
    if(dim.x === 3 && dim.y === 5) return <Theme0_3x5 {...arg} reference={reference} />;
    if(dim.x === 4 && dim.y === 4) return <Theme0_4x4 {...arg} reference={reference} />;
    if(dim.x === 4 && dim.y === 5) return <Theme0_4x5 {...arg} reference={reference} />;
    if(dim.x === 5 && dim.y === 5) return <Theme0_5x5 {...arg} reference={reference} />;
  }

  // other cases (will be added later when new models are added)
  else return (
    <Theme0_2x2 {...arg} reference={reference} />
  )

  return null;
}

export default Park