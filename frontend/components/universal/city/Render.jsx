import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber';

const Render = ({ fpsMax }) => {
  const { gl, invalidate } = useThree()
  const maxTicks = Math.round(60 / fpsMax)
  const ticksCounter = useRef(0)

  const step = () => {
    // increases the tick counter
    ticksCounter.current += 1
    if (ticksCounter.current > maxTicks) {
      // call invalidate to render a new frame
      invalidate()
      ticksCounter.current = 0
    }
  }

  useEffect(() => {
    gl.setAnimationLoop(step)
    return () => {
      gl.setAnimationLoop(null)
    }
  }, [])

  return null;
}

export default Render