
import React, {useState, useRef, Suspense} from 'react'
import * as THREE from 'three';
import {OrbitControls, Bounds} from "@react-three/drei"
import Link from "next/link"

import Buildings from '../components/game/Buildings';

//----COMPONENTS----//
import Lights from '../components/game/Lights'
import WorldCanvas from '../components/game/WorldCanvas';
import Landscape from '../components/game/modelComponents/ValleyLandscape'
import HTMLContent from '../components/game/HTMLContent'
import Grid from '../components/game/Grid';
import HoverObject from '../components/game/HoverObject.jsx';

//----CONSTANTS----//


//MAIN COMPONENT
const gameplay = () => {
  return (
    <>
      <div style={{position: "fixed",
        height: '90%',
        width: '90%',
        margin:'0px',
        padding:'0px',
        overflow:'hidden',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
          <HTMLContent/>
          <WorldCanvas>
            <OrbitControls/>
            <Lights/>
            <Grid/>
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1}>
                <Landscape scale={120} position={[-20,-23,2]}/>
                <Buildings/>
                <HoverObject/>
              </Bounds>
            </Suspense>
          </WorldCanvas>
      </div>
      <Link href="/"><a>Home</a></Link>      
    </>
  )
}

export default gameplay