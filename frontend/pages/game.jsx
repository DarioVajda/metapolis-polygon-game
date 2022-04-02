
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

function Plane(){
  return(
    <mesh position={[0,0,0]} rotation={[-Math.PI/2,0,0]}>
      <planeBufferGeometry attach="geometry" args={[100,100]}/>
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
            <spotLight position={[10,15,10]} angle={0.3}/>
            <Box position={[0,1,0]}/>
            <Plane/>
          </Canvas>
      </div>
    </>
  )
}

export default gameplay