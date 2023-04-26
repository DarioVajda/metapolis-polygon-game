// edited by the addingAnimations script!
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

// import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from 'three'

import { useSpring } from '@react-spring/three'
import { a } from '@react-spring/three'

const Theme0 = ({level, reference, ...props}) => {
  const { nodes, materials } = useGLTF("/Factory Lvl 1.gltf");
 
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

  let scale = 2.45;

  return (
    <group name="objectGroup" ref={reference} {...props} rotation={[0, Math.PI/2, 0]} scale={[scale, scale * (level*2+1), scale]} dispose={null}>
    {/* <group name="objectGroup" ref={reference} {...props} rotation={[0, 0, 0]} scale={[scale, scale * (level*2+1), scale]} dispose={null}> */}
      <group scale={[5.98, 1, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane007.geometry}
          material={materials["osnovna bela"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane007_1.geometry}
          material={materials.prag}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026.geometry}
        material={materials["RED BRICK"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_1.geometry}
        material={materials["tamna red cigla"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_2.geometry}
        material={materials["krov zgrade"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_3.geometry}
        material={materials.staklo}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_4.geometry}
        material={materials["red brick lite"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_5.geometry}
        material={materials["osnovna bela"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026_6.geometry}
        material={materials.tockovi}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere004.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere004_1.geometry}
        material={materials["krosnja cempres"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere005.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere005_1.geometry}
        material={materials.krosnja}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere006.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere006_1.geometry}
        material={materials.cempres}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vrata_garaza001.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube029.geometry}
        material={materials["tamna red cigla"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube029_1.geometry}
        material={materials.staklo}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vrata_garaza002.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vrata_garaza003.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vrata_garaza004.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033.geometry}
        material={materials.prag}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033_1.geometry}
        material={materials.staklo}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033_2.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033_3.geometry}
        material={materials.tockovi}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004.geometry}
        material={materials.cempres}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004_1.geometry}
        material={materials.zemlja}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004_2.geometry}
        material={materials["kora drverata braon"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004_3.geometry}
        material={materials["crkva zidovi"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube034.geometry}
        material={materials.agregati}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube034_1.geometry}
        material={materials.tockovi}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube034_2.geometry}
        material={materials["Material.010"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder025.geometry}
        material={materials["garazna vrata"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder025_1.geometry}
        material={materials["cerada red"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder025_2.geometry}
        material={materials["bela ograda"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube070.geometry}
        material={materials["red brick lite"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube070_1.geometry}
        material={materials.trava}
      />
    </group>
  );
};

useGLTF.preload("/Factory Lvl 1.gltf");

export default Theme0;
