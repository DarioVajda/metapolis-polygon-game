import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Landscape = ({ props }) => {
  const mesh = useRef();
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <>
      <mesh {...props} ref={mesh} position={[0, -1, 0]} >
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color={"lightgreen"} />
      </mesh>
      <mesh {...props} ref={mesh} position={[0, -12, 0]} >
        <boxGeometry args={[140, 20, 140]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </>
  );
}

export default Landscape