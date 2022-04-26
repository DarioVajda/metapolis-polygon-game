
import React, {useState, useRef} from 'react'
import {Canvas} from "@react-three/fiber";
import * as THREE from 'three';
import GameRender from '../components/GameRender'
import {OrbitControls, Stars, useHelper} from "@react-three/drei"
import Link from "next/link"
import { SpotLightHelper } from 'three';

function Box(props){
  const [hovered, setHover] = useState(false)

  return(
    <mesh 
      {...props}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
        
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color={hovered? 'hotpink' : 'orange'}/>
    </mesh>
  )
}

function Lights(target){
  const mesh = useRef()
  // useHelper(mesh, SpotLightHelper, 'cyan')
  return(
    <>
      <ambientLight intensity={0.1}/>
      {/* <hemisphereLight intensity={0.250} color="white" groundColor="skyblue" /> */}
      <spotLight ref={mesh} castShadow position={[-10,15,10]} angle={0.3} shadow-mapSize={[300, 300]} shadow-bias={0.00005} target-position={[0,0,0]}
      onUpdate={(self) => self.target.updateMatrixWorld()}/>
    </>
  )
}

function Plane(props){
  return(
    <mesh {...props} position={[0,0,0]} rotation={[-Math.PI/2,0,0]}>
      <boxBufferGeometry attach="geometry" args={[10,10,1]}/>
      <meshLambertMaterial attach="material" color="lime"/>
    </mesh>
  )
}



const gameplay = () => {
  return (
    <>
      <div style={{position: "fixed",
        height: '90%',
        width: '90%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'}}>
          

          <Canvas shadows orthographic
          onCreated={({ gl, scene, camera }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputEncoding = THREE.sRGBEncoding
            scene.background = new THREE.Color('#373740')
            camera.lookAt([0,0,0])
          }}
          camera={{fov:90, position:[10,7,11], zoom:30}}>

            <OrbitControls/>
            <Stars/>
            <Lights/>
            <Box castShadow receiveShadow position={[0,1,0]}/>
            <Plane receiveShadow/>
          </Canvas>
      </div>
      <GameRender/>
      <Link href="/"><a>Home</a></Link>
      
    </>
  )
}

export default gameplay