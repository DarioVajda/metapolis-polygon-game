// edited by the addingAnimations script!
// import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { plotSize } from '../../MapData';
import { MeshStandardMaterial } from 'three'

import { useSpring } from '@react-spring/three'
import { a } from '@react-spring/three'

const Theme0 = ({level, reference, ...props}) => {
 
  const { nodes, materials } = useGLTF("/Fontana.gltf");

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

  const scale = 2.45;

  return (
    <group name="objectGroup" ref={reference} {...props} rotation={[ props?.rotation[0], props?.rotation[1]+Math.PI/2, props?.rotation[2] ]} scale={[ scale, scale, scale ]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Baza_1x1004.geometry}
        material={nodes.Baza_1x1004.material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane028.geometry}
        material={materials.VODA}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane028_1.geometry}
        material={materials.FONTANA}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027.geometry}
        material={materials["spratovi.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027_1.geometry}
        material={materials["tamni crep.001"]}
      />
    </group>
  );
}

useGLTF.preload("/Fontana.gltf");

export default Theme0