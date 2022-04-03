
import React, {useState, useRef, Suspense} from 'react'
import {Canvas} from "@react-three/fiber";
import * as THREE from 'three';
import GameRender from '../components/GameRender'
import {OrbitControls, useHelper, useGLTF, Bounds} from "@react-three/drei"
import Link from "next/link"
import { SpotLightHelper } from 'three';

//----COMPONENTS----//
// import {Model} from '../components/game/Valley_lanscape2_real'
import Model from '../components/game/House1'

//----CONSTANTS----//
const models = '../../models/' //MODELS FOLDER
//GRID CONSTANTS//
const gridDimensions = 100;
const gridSize = 10;
const plotSize = gridDimensions/gridSize;
const shadowMapSize = [2048,2048]

//setting up the canvas
function WorldCanvas(props){
  return(
    <Canvas
    {...props}
    shadows orthographic
    onCreated={({ gl ,scene, camera }) => {
      gl.outputEncoding = THREE.sRGBEncoding
      scene.background = new THREE.Color('#373740')
      camera.lookAt([0,0,0])
      gl.shadowMap.type= THREE.PCFSoftShadowMap;
    }}
    camera={{fov:75, position:[10,7,11], zoom:30}}>
    </Canvas>
  )
}

function Lights(){
  return(
    <>
      <ambientLight intensity={0.1} />
      <spotLight castShadow color="white" intensity={2} position={[-50, 50, 40]} angle={0.5} shadow-mapSize={shadowMapSize} />
    </>
  )
}

//MAIN COMPONENT
const gameplay = () => {
  return (
    <>
      <div style={{position: "fixed",
        height: '90%',
        width: '90%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'}}>

          <WorldCanvas>
            <OrbitControls/>
            <Lights/>
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1}>
                <Model/>
              </Bounds>
            </Suspense>
          </WorldCanvas>
      </div>
      <GameRender/>
      <Link href="/"><a>Home</a></Link>
      
    </>
  )
}

export default gameplay