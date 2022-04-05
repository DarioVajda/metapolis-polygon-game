
import React, {useState, useRef, Suspense} from 'react'
import * as THREE from 'three';
import {OrbitControls, Bounds} from "@react-three/drei"
import Link from "next/link"

import Buildings from '../components/game/Buildings';

//----COMPONENTS----//
// import {Model} from '../components/game/Valley_lanscape2_real'
import Lights from '../components/game/Lights'
import WorldCanvas from '../components/game/WorldCanvas';
import Landscape from '../components/game/Valley_lanscape2_real'
import { generateUUID } from 'three/src/math/MathUtils';
import Grid from '../components/game/Grid';

//----CONSTANTS----//

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
            <Grid/>
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1}>
                <Landscape scale={120} position={[-20,-23,2]}/>
                <Buildings/>
              </Bounds>
            </Suspense>
          </WorldCanvas>
      </div>
      {/* <GameRender/> */}
      <Link href="/"><a>Home</a></Link>      
    </>
  )
}

export default gameplay