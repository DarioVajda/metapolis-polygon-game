import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber';

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
  
  /*

  const prevPosition = useRef({ x: 200, y: 225, z: 0})

  useFrame(({ camera }) => {
    console.log(
      Math.abs(camera.position.x - prevPosition.current.x) < 1e-4 && 
      Math.abs(camera.position.y - prevPosition.current.y) < 1e-4 && 
      Math.abs(camera.position.z - prevPosition.current.z) < 1e-4
    );
    console.log(camera.position, camera.rotation);
    // camera.position.x = prevPosition.current.x;
    // camera.position.y = prevPosition.current.y;
    // camera.position.z = prevPosition.current.z;
  }, -1);
  
  useFrame(({ camera }) => {
    // camera.lookAt([0, 0, 0]);
    prevPosition.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  }, 0);

  */

  useEffect(() => {
    gl.setAnimationLoop(step)
    return () => {
      gl.setAnimationLoop(null)
    }
  }, [])

  return null;
}

export default Render