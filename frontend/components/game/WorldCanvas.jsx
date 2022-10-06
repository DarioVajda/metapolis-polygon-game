//setting up the canvas
import { Canvas } from "@react-three/fiber";

function WorldCanvas(props){

  return(
    <Canvas
      {...props}
      shadows
      onCreated={null}
      camera={{ fov:40, position:[170, 170, 170], near: 0.1, far: 1000, aspect: 1/1 }}
      orthographic={false}
    />
  )
}

export default WorldCanvas;