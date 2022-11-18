import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { plotSize } from '../MapData';

const Store = forwardRef(function Store({level, ...props},ref) {
  return (
    <group name="objectGroup" ref={ref} {...props} scale={1} dispose={null}>
      <mesh scale={[plotSize * 0.9, 3, plotSize * 0.9]} position={[0, 1.5, 0]}>
        <boxBufferGeometry attach="geometry" />
        <meshLambertMaterial
          attach="material"
          color='chocolate'
        />
      </mesh>
      <mesh scale={[plotSize * 0.2, 1, plotSize * 0.2]} position={[1.5, 3, 1.5]}>
        <boxBufferGeometry attach="geometry" />
        <meshLambertMaterial
          attach="material"
          color='brown'
        />
      </mesh>
    </group>
  );
})

useGLTF.preload('/store.glb')
export default Store