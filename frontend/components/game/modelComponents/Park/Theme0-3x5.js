// edited by the addingAnimations script!
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

import { useSpring } from '@react-spring/three'
import { a } from '@react-spring/three'

const Theme0 = ({ reference, status, ...props}) => {
  const { nodes, materials } = useGLTF("/Park 3x5.gltf");

  const [ { opacity }, springApi ] = useSpring(() => ({
    opacity: 1,
    // from: {
      // opacity: 0
    // }
  }))

  const opacityToMaterial = (opacity, mat) => {
    mat.transparent = true;
    mat.opacity = opacity;
    return mat;
  }

  const scale = 2.45;
  
  return (
    <group name="objectGroup" ref={reference} {...props} scale={[ scale, scale, scale ]} rotation={[props.rotation[0], props.rotation[1] + Math.PI/2, props.rotation[2]]} dispose={null}>
      <group
        position={[-0.01, 0.1, -0.02]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={0.18}
      >
        <group position={[0.08, 2.63, -0.03]} scale={[1.14, 1.98, 1.14]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Icosphere021.geometry}
            material={materials.LP_wood}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Icosphere021_1.geometry}
            material={materials.LP_bark}
          />
        </group>
      </group>
      <group scale={[3, 1, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane030.geometry}
          material={materials["osnovna bela boja"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane030_1.geometry}
          material={materials.trava}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane030_2.geometry}
          material={materials["crkva zidovi"]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11038.geometry}
          material={materials["Bark.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11038_1.geometry}
          material={materials["Tree.003"]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11039.geometry}
          material={materials["Bark.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11039_1.geometry}
          material={materials["Tree.002"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cone017.geometry}
        material={materials["vrata.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cone017_1.geometry}
        material={materials["krosnja cempres"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere020.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere020_1.geometry}
        material={materials.krosnja}
      />
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11040.geometry}
          material={materials["Bark.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11040_1.geometry}
          material={materials["Tree.004"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027.geometry}
        material={materials.spratovi}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027_1.geometry}
        material={materials["tamni crep"]}
      />
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11041.geometry}
          material={materials["Bark.005"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11041_1.geometry}
          material={materials["Tree.005"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube071.geometry}
        material={materials["zuti market"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube071_1.geometry}
        material={materials["metalna ograda"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube071_2.geometry}
        material={materials["cerada red"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube071_3.geometry}
        material={materials.supermarket}
      />
      <group scale={0.16}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube072.geometry}
          material={materials["Kov kuce crep.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube072_1.geometry}
          material={materials["zuti market"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube075.geometry}
        material={materials["crkva zidovi"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube075_1.geometry}
        material={materials["vrata.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Low_poly_tree006.geometry}
        material={materials.Material}
        position={[0.01, 0, -0.01]}
        scale={0.19}
      />
    </group>
  )
}

useGLTF.preload("/Park 3x5.gltf");

export default Theme0