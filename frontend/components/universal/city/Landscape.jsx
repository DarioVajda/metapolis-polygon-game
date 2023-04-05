import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { plotSize } from "../../game/MapData";

const Landscape = ({ props, dimensions }) => {
  const mesh = useRef();

  const dim = dimensions || { x: 20, y: 20 }

  return (
    <>
      <mesh {...props} ref={mesh} position={[(dim.x-1)/2*plotSize, -1, (dim.y-1)/2*plotSize]} >
        <boxGeometry args={[ dim.x * plotSize, 1, dim.y * plotSize ]} />
        <meshStandardMaterial color={"darkgray"} />
      </mesh>
      {/* <mesh {...props} ref={mesh} position={[0, 1, 0]} >
        <boxGeometry args={[ 1, 1, 1 ]} />
        <meshStandardMaterial color={"red"} />
      </mesh> */}
      <mesh {...props} ref={mesh} position={[(dim.x-1)/2*plotSize, -12, (dim.y-1)/2*plotSize]} >
        <boxGeometry args={[ dim.x * plotSize + 40, 20, dim.y * plotSize + 40]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </>
  );
}

export default Landscape