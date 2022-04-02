
import React, {useState} from 'react'
import {Canvas} from "@react-three/fiber";
import * as THREE from 'three';
import GameRender from '../components/GameRender'
import {OrbitControls, Stars} from "@react-three/drei"
import Link from "next/link"

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
      <GameRender/>
      <Link href="/"><a>Home</a></Link>
      <div style={{position: "fixed",
        height: '90%',
        width: '90%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'}}>
          

          <Canvas shadows
          onCreated={({ gl, scene, camera }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputEncoding = THREE.sRGBEncoding
            scene.background = new THREE.Color('#373740')
            camera.lookAt([0,0,0])
          }}
          camera={{fov:90, position:[10,2,0]}}>

            <OrbitControls/>
            <Stars/>
            <ambientLight intensity={0.1}/>
            <hemisphereLight intensity={0.250} color="white" groundColor="skyblue" />
            <spotLight castShadow position={[-10,10,5]} angle={0.3} shadow-mapSize={[300, 300]} shadow-bias={0.00005}/>
            <Box castShadow receiveShadow position={[0,1,0]}/>
            <Plane receiveShadow/>
          </Canvas>
      </div>
    </>
  )
}

export default gameplay