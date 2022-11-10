import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { plotSize } from '../MapData';

const Store = forwardRef(function Store({level, ...props},ref) {
  console.log(props);
  return (
    <group name="objectGroup" ref={ref} {...props} scale={1} dispose={null}>
      <mesh scale={[plotSize * 0.95, 3, plotSize * 0.95 * 2]} position={[0, 1.5, 0]} >
        <boxBufferGeometry attach="geometry" />
        <meshLambertMaterial
          attach="material"
          color='burlywood'
        />
      </mesh>
    </group>
  );
})

useGLTF.preload('/store.glb')
export default Store