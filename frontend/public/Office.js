/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/office.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Plane001.geometry} material={materials.Concrete} position={[1.2, 0, -0.89]} scale={[30.19, 0.85, 49.06]} />
      <group position={[-30, 0, 30]} scale={[30, 1, 30]}>
        <mesh geometry={nodes.Plane005_1.geometry} material={materials['grass.004']} />
        <mesh geometry={nodes.Plane005_2.geometry} material={materials['grass.001']} />
        <mesh geometry={nodes.Plane005_3.geometry} material={materials['grass.002']} />
        <mesh geometry={nodes.Plane005_4.geometry} material={materials['grass.003']} />
      </group>
      <group position={[9.96, -0.1, -1.56]} scale={[3.73, 0.07, 3.28]}>
        <mesh geometry={nodes.Cube.geometry} material={materials.darker_snow} />
        <mesh geometry={nodes.Cube_1.geometry} material={materials.brown} />
      </group>
      <group position={[-18.87, 0.05, -1.56]} scale={[20.04, -0.22, 36.5]}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.floortile} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials['Material.001']} />
      </group>
      <group position={[6.3, 2.66, -1.58]} scale={[0.14, 0.86, 0.75]}>
        <mesh geometry={nodes.knob.geometry} material={materials.brown} />
        <mesh geometry={nodes.knob_1.geometry} material={materials.shiny} />
        <mesh geometry={nodes.knob_2.geometry} material={materials.snow} />
        <mesh geometry={nodes.knob_3.geometry} material={materials.floortile} />
      </group>
      <group position={[6.2, 22.75, -9.27]} rotation={[Math.PI, 0, Math.PI]} scale={[0.15, 2.12, 2.39]}>
        <mesh geometry={nodes.Cube012.geometry} material={materials['brown.020']} />
        <mesh geometry={nodes.Cube012_1.geometry} material={materials['shiny.011']} />
        <mesh geometry={nodes.Cube012_2.geometry} material={materials['snow.011']} />
        <mesh geometry={nodes.Cube012_3.geometry} material={materials['brown.021']} />
        <mesh geometry={nodes.Cube012_4.geometry} material={materials['shiny.012']} />
        <mesh geometry={nodes.Cube012_5.geometry} material={materials['snow.012']} />
        <mesh geometry={nodes.Cube012_6.geometry} material={materials['brown.004']} />
        <mesh geometry={nodes.Cube012_7.geometry} material={materials['shiny.004']} />
        <mesh geometry={nodes.Cube012_8.geometry} material={materials['snow.004']} />
        <mesh geometry={nodes.Cube012_9.geometry} material={materials['brown.003']} />
        <mesh geometry={nodes.Cube012_10.geometry} material={materials['shiny.003']} />
        <mesh geometry={nodes.Cube012_11.geometry} material={materials['snow.003']} />
        <mesh geometry={nodes.Cube012_12.geometry} material={materials['brown.001']} />
        <mesh geometry={nodes.Cube012_13.geometry} material={materials['shiny.001']} />
        <mesh geometry={nodes.Cube012_14.geometry} material={materials['snow.001']} />
        <mesh geometry={nodes.Cube012_15.geometry} material={materials['brown.002']} />
        <mesh geometry={nodes.Cube012_16.geometry} material={materials['shiny.002']} />
        <mesh geometry={nodes.Cube012_17.geometry} material={materials['snow.002']} />
        <mesh geometry={nodes.Cube012_18.geometry} material={materials['brown.022']} />
        <mesh geometry={nodes.Cube012_19.geometry} material={materials['shiny.013']} />
        <mesh geometry={nodes.Cube012_20.geometry} material={materials['snow.013']} />
        <mesh geometry={nodes.Cube012_21.geometry} material={materials['brown.023']} />
        <mesh geometry={nodes.Cube012_22.geometry} material={materials['shiny.014']} />
        <mesh geometry={nodes.Cube012_23.geometry} material={materials['snow.014']} />
        <mesh geometry={nodes.Cube012_24.geometry} material={materials['brown.024']} />
        <mesh geometry={nodes.Cube012_25.geometry} material={materials['shiny.015']} />
        <mesh geometry={nodes.Cube012_26.geometry} material={materials['snow.015']} />
        <mesh geometry={nodes.Cube012_27.geometry} material={materials['brown.025']} />
        <mesh geometry={nodes.Cube012_28.geometry} material={materials['shiny.016']} />
        <mesh geometry={nodes.Cube012_29.geometry} material={materials['snow.016']} />
        <mesh geometry={nodes.Cube012_30.geometry} material={materials['brown.026']} />
        <mesh geometry={nodes.Cube012_31.geometry} material={materials['shiny.017']} />
        <mesh geometry={nodes.Cube012_32.geometry} material={materials['snow.017']} />
        <mesh geometry={nodes.Cube012_33.geometry} material={materials['brown.027']} />
        <mesh geometry={nodes.Cube012_34.geometry} material={materials['shiny.018']} />
        <mesh geometry={nodes.Cube012_35.geometry} material={materials['snow.018']} />
        <mesh geometry={nodes.Cube012_36.geometry} material={materials['brown.028']} />
        <mesh geometry={nodes.Cube012_37.geometry} material={materials['shiny.019']} />
        <mesh geometry={nodes.Cube012_38.geometry} material={materials['snow.019']} />
        <mesh geometry={nodes.Cube012_39.geometry} material={materials['brown.029']} />
        <mesh geometry={nodes.Cube012_40.geometry} material={materials['shiny.020']} />
        <mesh geometry={nodes.Cube012_41.geometry} material={materials['snow.020']} />
        <mesh geometry={nodes.Cube012_42.geometry} material={materials['brown.030']} />
        <mesh geometry={nodes.Cube012_43.geometry} material={materials['shiny.021']} />
        <mesh geometry={nodes.Cube012_44.geometry} material={materials['snow.021']} />
        <mesh geometry={nodes.Cube012_45.geometry} material={materials['brown.031']} />
        <mesh geometry={nodes.Cube012_46.geometry} material={materials['shiny.022']} />
        <mesh geometry={nodes.Cube012_47.geometry} material={materials['snow.022']} />
      </group>
      <group position={[-43.7, 22.75, 5.93]} scale={[0.15, 2.12, 2.39]}>
        <mesh geometry={nodes.Cube021.geometry} material={materials['brown.032']} />
        <mesh geometry={nodes.Cube021_1.geometry} material={materials['shiny.023']} />
        <mesh geometry={nodes.Cube021_2.geometry} material={materials['snow.023']} />
        <mesh geometry={nodes.Cube021_3.geometry} material={materials['brown.033']} />
        <mesh geometry={nodes.Cube021_4.geometry} material={materials['shiny.024']} />
        <mesh geometry={nodes.Cube021_5.geometry} material={materials['snow.024']} />
        <mesh geometry={nodes.Cube021_6.geometry} material={materials['brown.034']} />
        <mesh geometry={nodes.Cube021_7.geometry} material={materials['shiny.025']} />
        <mesh geometry={nodes.Cube021_8.geometry} material={materials['snow.025']} />
        <mesh geometry={nodes.Cube021_9.geometry} material={materials['brown.035']} />
        <mesh geometry={nodes.Cube021_10.geometry} material={materials['shiny.026']} />
        <mesh geometry={nodes.Cube021_11.geometry} material={materials['snow.026']} />
        <mesh geometry={nodes.Cube021_12.geometry} material={materials['brown.036']} />
        <mesh geometry={nodes.Cube021_13.geometry} material={materials['shiny.027']} />
        <mesh geometry={nodes.Cube021_14.geometry} material={materials['snow.027']} />
        <mesh geometry={nodes.Cube021_15.geometry} material={materials['brown.037']} />
        <mesh geometry={nodes.Cube021_16.geometry} material={materials['shiny.028']} />
        <mesh geometry={nodes.Cube021_17.geometry} material={materials['snow.028']} />
        <mesh geometry={nodes.Cube021_18.geometry} material={materials['brown.038']} />
        <mesh geometry={nodes.Cube021_19.geometry} material={materials['shiny.029']} />
        <mesh geometry={nodes.Cube021_20.geometry} material={materials['snow.029']} />
        <mesh geometry={nodes.Cube021_21.geometry} material={materials['brown.039']} />
        <mesh geometry={nodes.Cube021_22.geometry} material={materials['shiny.030']} />
        <mesh geometry={nodes.Cube021_23.geometry} material={materials['snow.030']} />
        <mesh geometry={nodes.Cube021_24.geometry} material={materials['brown.040']} />
        <mesh geometry={nodes.Cube021_25.geometry} material={materials['shiny.031']} />
        <mesh geometry={nodes.Cube021_26.geometry} material={materials['snow.031']} />
        <mesh geometry={nodes.Cube021_27.geometry} material={materials['brown.041']} />
        <mesh geometry={nodes.Cube021_28.geometry} material={materials['shiny.032']} />
        <mesh geometry={nodes.Cube021_29.geometry} material={materials['snow.032']} />
        <mesh geometry={nodes.Cube021_30.geometry} material={materials['brown.042']} />
        <mesh geometry={nodes.Cube021_31.geometry} material={materials['shiny.033']} />
        <mesh geometry={nodes.Cube021_32.geometry} material={materials['snow.033']} />
        <mesh geometry={nodes.Cube021_33.geometry} material={materials['brown.043']} />
        <mesh geometry={nodes.Cube021_34.geometry} material={materials['shiny.034']} />
        <mesh geometry={nodes.Cube021_35.geometry} material={materials['snow.034']} />
        <mesh geometry={nodes.Cube021_36.geometry} material={materials['brown.044']} />
        <mesh geometry={nodes.Cube021_37.geometry} material={materials['shiny.035']} />
        <mesh geometry={nodes.Cube021_38.geometry} material={materials['snow.035']} />
        <mesh geometry={nodes.Cube021_39.geometry} material={materials['brown.045']} />
        <mesh geometry={nodes.Cube021_40.geometry} material={materials['shiny.036']} />
        <mesh geometry={nodes.Cube021_41.geometry} material={materials['snow.036']} />
        <mesh geometry={nodes.Cube021_42.geometry} material={materials['brown.046']} />
        <mesh geometry={nodes.Cube021_43.geometry} material={materials['shiny.037']} />
        <mesh geometry={nodes.Cube021_44.geometry} material={materials['snow.037']} />
        <mesh geometry={nodes.Cube021_45.geometry} material={materials['brown.047']} />
        <mesh geometry={nodes.Cube021_46.geometry} material={materials['shiny.038']} />
        <mesh geometry={nodes.Cube021_47.geometry} material={materials['snow.038']} />
      </group>
      <group position={[48.79, 0.34, 11.31]} rotation={[0.14, -0.16, 0.03]} scale={0.75}>
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials['brown.011']} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials.green2} />
      </group>
      <group position={[44.68, 0.34, -28.64]} rotation={[0.17, 0.62, -0.09]} scale={0.75}>
        <mesh geometry={nodes.Cylinder002_1.geometry} material={materials['brown.012']} />
        <mesh geometry={nodes.Cylinder002_2.geometry} material={materials['green2.001']} />
      </group>
      <group position={[-51.15, 0.34, 50.84]} rotation={[0.14, -0.16, 0.03]} scale={0.75}>
        <mesh geometry={nodes.Cylinder010.geometry} material={materials['brown.016']} />
        <mesh geometry={nodes.Cylinder010_1.geometry} material={materials['green2.005']} />
      </group>
      <group position={[-52.82, 0.34, 13.9]} rotation={[0.14, -0.33, 0.05]} scale={0.75}>
        <mesh geometry={nodes.Cylinder013.geometry} material={materials['brown.019']} />
        <mesh geometry={nodes.Cylinder013_1.geometry} material={materials['green2.008']} />
      </group>
      <group position={[51.04, 0.34, 39.43]} rotation={[-0.06, 0.35, -0.02]} scale={0.75}>
        <mesh geometry={nodes.Cylinder006.geometry} material={materials['brown.011']} />
        <mesh geometry={nodes.Cylinder006_1.geometry} material={materials.green2} />
      </group>
      <group position={[35.09, 0.34, 30.08]} rotation={[-0.13, 1.49, 0]} scale={0.75}>
        <mesh geometry={nodes.Cylinder007.geometry} material={materials['brown.011']} />
        <mesh geometry={nodes.Cylinder007_1.geometry} material={materials.green2} />
      </group>
      <group position={[5.53, 0.34, -56.08]} rotation={[-0.01, -0.17, -0.13]} scale={0.75}>
        <mesh geometry={nodes.Cylinder004.geometry} material={materials['brown.014']} />
        <mesh geometry={nodes.Cylinder004_1.geometry} material={materials['green2.003']} />
      </group>
      <group position={[1.53, 0.34, 52.45]} rotation={[-0.13, 1.49, 0]} scale={0.75}>
        <mesh geometry={nodes.Cylinder009.geometry} material={materials['brown.015']} />
        <mesh geometry={nodes.Cylinder009_1.geometry} material={materials['green2.004']} />
      </group>
      <group position={[38.26, 0.34, 18.57]} rotation={[-0.06, 0.35, -0.02]} scale={0.75}>
        <mesh geometry={nodes.Cylinder008.geometry} material={materials['brown.011']} />
        <mesh geometry={nodes.Cylinder008_1.geometry} material={materials.green2} />
      </group>
      <group position={[42.37, 0.34, -16.06]} rotation={[-0.14, 1.13, 0.09]} scale={0.75}>
        <mesh geometry={nodes.Cylinder001_1.geometry} material={materials['brown.012']} />
        <mesh geometry={nodes.Cylinder001_2.geometry} material={materials['green2.001']} />
      </group>
      <group position={[50.86, 0.34, -44.81]} rotation={[-0.07, -0.52, -0.07]} scale={0.75}>
        <mesh geometry={nodes.Cylinder005.geometry} material={materials['brown.013']} />
        <mesh geometry={nodes.Cylinder005_1.geometry} material={materials['green2.002']} />
      </group>
      <group position={[16.72, 0.34, -51.92]} rotation={[-0.22, -1.3, -0.25]} scale={0.75}>
        <mesh geometry={nodes.Cylinder003.geometry} material={materials['brown.014']} />
        <mesh geometry={nodes.Cylinder003_1.geometry} material={materials['green2.003']} />
      </group>
      <group position={[-22.8, 0.34, -54.16]} rotation={[-0.22, -1.3, -0.25]} scale={0.75}>
        <mesh geometry={nodes.Cylinder011.geometry} material={materials['brown.017']} />
        <mesh geometry={nodes.Cylinder011_1.geometry} material={materials['green2.006']} />
      </group>
      <group position={[-54.4, 0.34, -14.17]} rotation={[-0.1, 0.96, 0.04]} scale={0.75}>
        <mesh geometry={nodes.Cylinder012.geometry} material={materials['brown.018']} />
        <mesh geometry={nodes.Cylinder012_1.geometry} material={materials['green2.007']} />
      </group>
      <mesh geometry={nodes.Cone.geometry} material={materials['rock.002']} position={[44.55, -0.1, 27.41]} rotation={[0, -0.38, 0]} scale={0.75} />
      <mesh geometry={nodes.Cone001.geometry} material={materials['rock.002']} position={[34.7, -0.1, -10.89]} rotation={[Math.PI, -1.56, Math.PI]} scale={1.26} />
      <mesh geometry={nodes.Cylinder.geometry} material={materials['rock.001']} position={[53.98, -0.16, -36.79]} rotation={[0, -0.52, 0]} scale={1.33} />
      <mesh geometry={nodes.Cylinder001.geometry} material={materials['rock.001']} position={[-4.94, -0.9, -51.76]} rotation={[0.36, 0.23, 0]} scale={1.33} />
      <mesh geometry={nodes.Cylinder002.geometry} material={materials['rock.003']} position={[-41.49, -0.9, 52.65]} rotation={[0.35, -0.09, 0.12]} scale={1.33} />
    </group>
  )
}

useGLTF.preload('/office.glb')
