
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

//----VARIABLES----//
let initialised=false;

//----FUNCTIONS----//
const initCity = async (id) => {
  const message = `Initialize #${id} City NFT`;

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  let body = JSON.stringify({address: address, message: message, signature: signature});
  console.log(body);
  const response = await fetch(`http://localhost:8000/cities/${id}/initialize`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: body
  });
  console.log(response);
};





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
      <Link href="/"><a>Home</a></Link> <br />
      <Link href='/leaderboard'><a>Leaderboard</a></Link> <br />
    </>
  )
}
  ///CAMERA IS FUCKED UP BECAUSE OF MODELS, THEIR SCALE FUCKS SHIT UP

export default gameplay