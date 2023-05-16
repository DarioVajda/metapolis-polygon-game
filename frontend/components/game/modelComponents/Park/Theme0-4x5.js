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
  const { nodes, materials } = useGLTF("/Park 4x5.gltf");

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
      <group scale={[3, 1, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane015.geometry}
          material={materials["osnovna bela boja"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane015_1.geometry}
          material={materials.trava}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane015_2.geometry}
          material={materials["crkva zidovi"]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11034.geometry}
          material={materials["Bark.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11034_1.geometry}
          material={materials["Tree.003"]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11035.geometry}
          material={materials["Bark.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11035_1.geometry}
          material={materials["Tree.002"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cone016.geometry}
        material={materials["vrata.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cone016_1.geometry}
        material={materials["krosnja cempres"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere018.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere018_1.geometry}
        material={materials.krosnja}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014.geometry}
        material={materials.spratovi}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014_1.geometry}
        material={materials["tamni crep"]}
      />
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11036.geometry}
          material={materials["Bark.005"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11036_1.geometry}
          material={materials["Tree.005"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.LAKE_WATER003.geometry}
        material={materials.VODA}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Lake_stones003.geometry}
        material={materials.zemlja}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.GRASS_1003.geometry}
        material={materials["bf_grass.002"]}
        position={[-0.01, 0, 0]}
        rotation={[0, -1.27, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019.geometry}
        material={materials["crkva zidovi"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019_1.geometry}
        material={materials["cerada red"]}
      />
      <group scale={0.16}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube039.geometry}
          material={materials["zuti market"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube039_1.geometry}
          material={materials["cerada red"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube042.geometry}
        material={materials["zuti market"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube042_1.geometry}
        material={materials.supermarket}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube042_2.geometry}
        material={materials.kolica}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube042_3.geometry}
        material={materials["cerada red"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015.geometry}
        material={materials["cerada red"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015_1.geometry}
        material={materials.supermarket}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015_2.geometry}
        material={materials["zuti market"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015_3.geometry}
        material={materials.FONTANA}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube051.geometry}
        material={materials["zuti market"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube051_1.geometry}
        material={materials["cerada red"]}
      />
      <group position={[0, -0.01, 0]} scale={0.03}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016.geometry}
          material={materials["Material.011"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016_1.geometry}
          material={materials["Material.012"]}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11037.geometry}
          material={materials["Bark.005"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tree_lp_11037_1.geometry}
          material={materials["Tree.005"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Low_poly_tree005.geometry}
        material={materials["Material.001"]}
        position={[0.01, 0, -0.01]}
        scale={0.19}
      />
      <group position={[0.03, 0, -0.02]} scale={0.16}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane023.geometry}
          material={materials["Low Poly Grass_Grass"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane023_1.geometry}
          material={materials["Low Poly Grass_Flower"]}
        />
      </group>
    </group>
  )
}

useGLTF.preload("/Park 4x5.gltf");

export default Theme0