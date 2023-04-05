import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { plotSize } from "./MapData";

function WorldCanvas({ style, pixelRatio, position, frameloop, dimensions, children}){

  let dim = dimensions || { x: 20, y: 20 };
  let offset = [ -(dim.x-1) * plotSize / 2, 0, -(dim.y-1) * plotSize / 2 ];

  const pos = position !== undefined ? position : [0, 200, 0];
  // const pos = position?position:[175, 175, 175];
  const frloop = frameloop?frameloop:'demand';

  return(
    <Canvas
      shadows
      onCreated={null}
      // camera={{ fov:40, position: pos, near: 0.1, far: 1000, aspect: 1/1, rotation: [ -Math.PI/2, 0, 0 ] }}
      camera={{ fov:40, position: pos, near: 0.1, far: 1000, aspect: 1/1, rotation: [ -Math.PI/2, 0, 0 ] }}
      orthographic={false}
      frameloop={frloop}
      dpr={pixelRatio?pixelRatio:1}
      style={style}
    >
      <Suspense fallback={null} r3f>
        <group position={offset}>
          {children}
        </group>
      </Suspense>
    </Canvas>
  )
}

export default WorldCanvas;