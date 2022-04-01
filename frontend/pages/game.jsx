
import React, {useState} from 'react'
import {Canvas} from "@react-three/fiber";
import * as THREE from 'three';
import GameRender from '../components/GameRender'
import {OrbitControls, Stars} from "@react-three/drei"
import Link from "next/link"

function Box(){
  return(
    <mesh>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink"/>
    </mesh>
  )
}


const gameplay = () => {
  return (
    <>
        <GameRender/>
        <Link href="/"><a>Home</a></Link>
        <Canvas 
        // pixelRatio={window.devicePixelRatio}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputEncoding = THREE.sRGBEncoding
          scene.background = new THREE.Color('#373740')
        }}>
          <OrbitControls/>
          <Stars/>
          <ambientLight intensity={0.5}/>
          <spotLight position={[10,15,10]} angle={0.3}
          
          />
          <Box/>
        </Canvas>;
    </>
  )
}

export default gameplay