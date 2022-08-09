/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react';

const Building = forwardRef(function Building(props,ref) {
  const { nodes, materials } = useGLTF('/Building.glb')
  return (
    <group name="objectGroup" ref={ref} {...props} dispose={null}>
      <mesh
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={materials.Concrete}
        position={[1.2, 0, -0.89]}
        scale={[30.19, 0.85, 49.06]}
      />
      <group position={[-30, 0, 30]} scale={[30, 1, 30]}>
        <mesh receiveShadow geometry={nodes.Plane005_1.geometry} material={materials["grass.004"]} />
        <mesh receiveShadow geometry={nodes.Plane005_2.geometry} material={materials["grass.001"]} />
        <mesh receiveShadow geometry={nodes.Plane005_3.geometry} material={materials["grass.002"]} />
        <mesh receiveShadow geometry={nodes.Plane005_4.geometry} material={materials["grass.003"]} />
      </group>
      <mesh
        castShadow
        geometry={nodes.GaragesQuad.geometry}
        material={materials["Material.004"]}
        position={[21.68, 0.65, 35.01]}
        scale={[5.67, 0.75, 7.23]}
      />
      <group position={[21.68, 0.65, 27.7]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube004.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube004_1.geometry} material={materials["Material.003"]} />
      </group>
      <group position={[10.35, 0.65, 27.7]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube005.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube005_1.geometry} material={materials["Material.003"]} />
      </group>
      <group position={[-0.99, 0.65, 27.7]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube006.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube006_1.geometry} material={materials["Material.003"]} />
      </group>
      <group position={[-12.32, 0.65, 27.7]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube007.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube007_1.geometry} material={materials["Material.003"]} />
      </group>
      <mesh
        castShadow
        geometry={nodes.GaragesDouble.geometry}
        material={materials["Material.004"]}
        position={[-29.03, 0.58, 18.6]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[5.67, 0.75, 7.23]}
      />
      <group position={[-21.72, 0.65, 18.6]} rotation={[0, -Math.PI / 2, 0]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube008.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube008_1.geometry} material={materials["Material.003"]} />
      </group>
      <group position={[-21.72, 0.65, 7.26]} rotation={[0, -Math.PI / 2, 0]} scale={[4.36, 0.75, -0.15]}>
        <mesh castShadow geometry={nodes.Cube009.geometry} material={materials["Material.002"]} />
        <mesh castShadow geometry={nodes.Cube009_1.geometry} material={materials["Material.003"]} />
      </group>
      <group position={[-15.94, -0.1, -22.56]} scale={[3.73, 0.07, 3.28]}>
        <mesh castShadow geometry={nodes.Cube.geometry} material={materials.darker_snow} />
        <mesh castShadow geometry={nodes.Cube_1.geometry} material={materials.brown} />
      </group>
      <group position={[-32.87, 0.05, -22.56]} scale={[10.55, -0.22, 19.21]}>
        <mesh castShadow geometry={nodes.Cube001.geometry} material={materials.floortile} />
        <mesh castShadow geometry={nodes.Cube001_1.geometry} material={materials["Material.001"]} />
      </group>
      <group position={[-19.6, 2.66, -22.58]} scale={[0.14, 0.86, 0.75]}>
        <mesh castShadow geometry={nodes.knob.geometry} material={materials.brown} />
        <mesh castShadow geometry={nodes.knob_1.geometry} material={materials.shiny} />
        <mesh castShadow geometry={nodes.knob_2.geometry} material={materials.snow} />
        <mesh castShadow geometry={nodes.knob_3.geometry} material={materials.floortile} />
      </group>
      <group position={[-19.7, 23.42, -15.27]} rotation={[Math.PI, 0, Math.PI]} scale={[0.15, 2.12, 2.39]}>
        <mesh castShadow geometry={nodes.Cube013.geometry} material={materials["brown.005"]} />
        <mesh castShadow geometry={nodes.Cube013_1.geometry} material={materials["shiny.005"]} />
        <mesh castShadow geometry={nodes.Cube013_2.geometry} material={materials["snow.005"]} />
        <mesh castShadow geometry={nodes.Cube013_3.geometry} material={materials["brown.006"]} />
        <mesh castShadow geometry={nodes.Cube013_4.geometry} material={materials["shiny.006"]} />
        <mesh castShadow geometry={nodes.Cube013_5.geometry} material={materials["snow.006"]} />
      </group>
      <group position={[-19.7, 38.33, -15.27]} rotation={[Math.PI, 0, Math.PI]} scale={[0.15, 2.12, 2.39]}>
        <mesh castShadow geometry={nodes.Cube015.geometry} material={materials["brown.009"]} />
        <mesh castShadow geometry={nodes.Cube015_1.geometry} material={materials["shiny.009"]} />
        <mesh castShadow geometry={nodes.Cube015_2.geometry} material={materials["snow.009"]} />
        <mesh castShadow geometry={nodes.Cube015_3.geometry} material={materials["brown.010"]} />
        <mesh castShadow geometry={nodes.Cube015_4.geometry} material={materials["shiny.010"]} />
        <mesh castShadow geometry={nodes.Cube015_5.geometry} material={materials["snow.010"]} />
      </group>
      <group position={[-19.7, 7.75, -15.27]} rotation={[Math.PI, 0, Math.PI]} scale={[0.15, 2.12, 2.39]}>
        <mesh castShadow geometry={nodes.Cube011.geometry} material={materials["brown.004"]} />
        <mesh castShadow geometry={nodes.Cube011_1.geometry} material={materials["shiny.004"]} />
        <mesh castShadow geometry={nodes.Cube011_2.geometry} material={materials["snow.004"]} />
        <mesh castShadow geometry={nodes.Cube011_3.geometry} material={materials["brown.003"]} />
        <mesh castShadow geometry={nodes.Cube011_4.geometry} material={materials["shiny.003"]} />
        <mesh castShadow geometry={nodes.Cube011_5.geometry} material={materials["snow.003"]} />
      </group>
      <group position={[-19.7, 53.99, -15.27]} rotation={[Math.PI, 0, Math.PI]} scale={[0.15, 2.12, 2.39]}>
        <mesh castShadow geometry={nodes.Cube014.geometry} material={materials["brown.008"]} />
        <mesh castShadow geometry={nodes.Cube014_1.geometry} material={materials["shiny.008"]} />
        <mesh castShadow geometry={nodes.Cube014_2.geometry} material={materials["snow.008"]} />
        <mesh castShadow geometry={nodes.Cube014_3.geometry} material={materials["brown.007"]} />
        <mesh castShadow geometry={nodes.Cube014_4.geometry} material={materials["shiny.007"]} />
        <mesh castShadow geometry={nodes.Cube014_5.geometry} material={materials["snow.007"]} />
      </group>
      <group position={[48.79, 0.34, 11.31]} rotation={[0.14, -0.16, 0.03]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder_1.geometry} material={materials["brown.011"]} />
        <mesh castShadow geometry={nodes.Cylinder_2.geometry} material={materials.green2} />
      </group>
      <group position={[44.68, 0.34, -28.64]} rotation={[0.17, 0.62, -0.09]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder002_1.geometry} material={materials["brown.012"]} />
        <mesh castShadow geometry={nodes.Cylinder002_2.geometry} material={materials["green2.001"]} />
      </group>
      <group position={[-51.15, 0.34, 50.84]} rotation={[0.14, -0.16, 0.03]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder010.geometry} material={materials["brown.016"]} />
        <mesh castShadow geometry={nodes.Cylinder010_1.geometry} material={materials["green2.005"]} />
      </group>
      <group position={[-52.82, 0.34, 13.9]} rotation={[0.14, -0.33, 0.05]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder013.geometry} material={materials["brown.019"]} />
        <mesh castShadow geometry={nodes.Cylinder013_1.geometry} material={materials["green2.008"]} />
      </group>
      <group position={[51.04, 0.34, 39.43]} rotation={[-0.06, 0.35, -0.02]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder006.geometry} material={materials["brown.011"]} />
        <mesh castShadow geometry={nodes.Cylinder006_1.geometry} material={materials.green2} />
      </group>
      <group position={[35.09, 0.34, 30.08]} rotation={[-0.13, 1.49, 0]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder007.geometry} material={materials["brown.011"]} />
        <mesh castShadow geometry={nodes.Cylinder007_1.geometry} material={materials.green2} />
      </group>
      <group position={[5.53, 0.34, -56.08]} rotation={[-0.01, -0.17, -0.13]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder004.geometry} material={materials["brown.014"]} />
        <mesh castShadow geometry={nodes.Cylinder004_1.geometry} material={materials["green2.003"]} />
      </group>
      <group position={[1.53, 0.34, 52.45]} rotation={[-0.13, 1.49, 0]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder009.geometry} material={materials["brown.015"]} />
        <mesh castShadow geometry={nodes.Cylinder009_1.geometry} material={materials["green2.004"]} />
      </group>
      <group position={[38.26, 0.34, 18.57]} rotation={[-0.06, 0.35, -0.02]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder008.geometry} material={materials["brown.011"]} />
        <mesh castShadow geometry={nodes.Cylinder008_1.geometry} material={materials.green2} />
      </group>
      <group position={[42.37, 0.34, -16.06]} rotation={[-0.14, 1.13, 0.09]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder001_1.geometry} material={materials["brown.012"]} />
        <mesh castShadow geometry={nodes.Cylinder001_2.geometry} material={materials["green2.001"]} />
      </group>
      <group position={[50.86, 0.34, -44.81]} rotation={[-0.07, -0.52, -0.07]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder005.geometry} material={materials["brown.013"]} />
        <mesh castShadow geometry={nodes.Cylinder005_1.geometry} material={materials["green2.002"]} />
      </group>
      <group position={[16.72, 0.34, -51.92]} rotation={[-0.22, -1.3, -0.25]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder003.geometry} material={materials["brown.014"]} />
        <mesh castShadow geometry={nodes.Cylinder003_1.geometry} material={materials["green2.003"]} />
      </group>
      <group position={[-22.8, 0.34, -54.16]} rotation={[-0.22, -1.3, -0.25]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder011.geometry} material={materials["brown.017"]} />
        <mesh castShadow geometry={nodes.Cylinder011_1.geometry} material={materials["green2.006"]} />
      </group>
      <group position={[-54.4, 0.34, -14.17]} rotation={[-0.1, 0.96, 0.04]} scale={0.75}>
        <mesh castShadow geometry={nodes.Cylinder012.geometry} material={materials["brown.018"]} />
        <mesh castShadow geometry={nodes.Cylinder012_1.geometry} material={materials["green2.007"]} />
      </group>
      <mesh
        castShadow
        geometry={nodes.Cone.geometry}
        material={materials["rock.002"]}
        position={[44.55, -0.1, 27.41]}
        rotation={[0, -0.38, 0]}
        scale={0.75}
      />
      <mesh
        castShadow
        geometry={nodes.Cone001.geometry}
        material={materials["rock.002"]}
        position={[34.7, -0.1, -10.89]}
        rotation={[Math.PI, -1.56, Math.PI]}
        scale={1.26}
      />
      <mesh
        castShadow
        geometry={nodes.Cylinder.geometry}
        material={materials["rock.001"]}
        position={[53.98, -0.16, -36.79]}
        rotation={[0, -0.52, 0]}
        scale={1.33}
      />
      <mesh
        castShadow
        geometry={nodes.Cylinder001.geometry}
        material={materials["rock.001"]}
        position={[-4.94, -0.9, -51.76]}
        rotation={[0.36, 0.23, 0]}
        scale={1.33}
      />
      <mesh
        castShadow
        geometry={nodes.Cylinder002.geometry}
        material={materials["rock.003"]}
        position={[-41.49, -0.9, 52.65]}
        rotation={[0.35, -0.09, 0.12]}
        scale={1.33}
      />
    </group>
  );
});

useGLTF.preload('/Building.glb')
export default Building;