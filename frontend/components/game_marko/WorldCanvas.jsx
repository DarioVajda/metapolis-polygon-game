//setting up the canvas
import { Canvas } from "@react-three/fiber";

function WorldCanvas({ style, pixelRatio, position, frameloop, children}){

  const pos = position?position:175;
  const frloop = frameloop?frameloop:'demand';

  return(
    <Canvas
      shadows
      onCreated={null}
      camera={{ fov:40, position:[pos, pos, pos], near: 0.1, far: 1000, aspect: 1/1 }}
      orthographic={false}
      frameloop={frloop}
      dpr={pixelRatio?pixelRatio:1}
      style={style}
    >
      {children}
    </Canvas>
  )
}

export default WorldCanvas;