// edited by the addingAnimations script!
// import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { plotSize } from '../../MapData';
import { MeshStandardMaterial } from 'three'

import { useSpring } from '@react-spring/three'
import { a } from '@react-spring/three'

const Theme0 = ({level, reference, ...props}) => {

  const { opacity } = useSpring({
    opacity: 1,
    // from: {
      // opacity: 0
    // }
  })
  const opacityToMaterial = (opacity, mat) => {
    // console.log(opacity);
    // let mat = new MeshStandardMaterial(material);
    mat.transparent = true;
    mat.opacity = opacity;
    return mat;
  }

  return (
    <group name="objectGroup" ref={reference} {...props} scale={1} dispose={null}>
      <a.mesh scale={[plotSize * 0.95, 3, plotSize * 0.95 * 2]} position={[0, 1.5, 0]} >
        <boxBufferGeometry attach="geometry" />
        <a.meshLambertMaterial
          attach="material"
          color='burlywood'
        />
      </a.mesh>
      <a.mesh scale={[plotSize * 0.2, 1, plotSize * 0.2]} position={[1.5, 3, 4]}>
        <boxBufferGeometry attach="geometry" />
        <a.meshLambertMaterial
          attach="material"
          color='yellow'
        />
      </a.mesh>
    </group>
  );
}

export default Theme0