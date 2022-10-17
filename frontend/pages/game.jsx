import React, { useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { OrbitControls, Bounds } from "@react-three/drei";
import Link from "next/link";
import Buildings from "../components/game_marko/Buildings";
import styles from "../components/styles/Game.module.css";

//----COMPONENTS----//
import Lights from "../components/game_marko/Lights";
import WorldCanvas from "../components/game_marko/WorldCanvas";
import Landscape from "../components/game_marko/modelComponents/ValleyLandscape";
import HTMLContent from "../components/game_marko/HTMLContent";
import Grid from "../components/game_marko/Grid";
import HoverObject from "../components/game_marko/HoverObject.jsx";
import { ID } from "../components/game_marko/GridData";
import { ethers } from "ethers";
import { generateUUID } from "three/src/math/MathUtils";
import FloatingMenu from "../components/game_marko/FloatingMenu";

//----CONSTANTS----//

//----VARIABLES----//
let initialised = false;

//----FUNCTIONS----//
const initCity = async (id) => {
  const message = `Initialize #${id} City NFT`;

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  let body = JSON.stringify({ address: address, message: message, signature: signature });
  console.log(body);
  const response = await fetch(`http://localhost:8000/cities/${id}/initialize`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
  console.log(response);
};

//MAIN COMPONENT
const gameplay = () => {
  // getIncome(1)
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.rowWrapper}>
        <div className={styles.gameContainer}>
          <HTMLContent ID={ID} />
          <WorldCanvas style={{ width: "100%", height: "100%", display: "block" }} pos={50} frameloop='always' >
            <OrbitControls />
            <Lights />
            <Grid ID={ID} />
            <Suspense fallback={null}>
              <Bounds fit clip margin={1}>
                {/* <Landscape scale={120} position={[-20, -23, 2]} /> */}
                <FloatingMenu style={{ backgroundColor: "transparent" }} />
                <Buildings ID={ID} />
                <HoverObject />
              </Bounds>
            </Suspense>
          </WorldCanvas>
        </div>
      </div>
    </div>
  );
};
///CAMERA IS BROKEN BECAUSE OF MODELS, THEIR SCALE BREAKS STUFF

export default gameplay;




/*


PLAN:

- trebaju da se razdvoje 3d komponente na vise grupa
  - STATICNE - menjaju se jako retko ili nikad (landscape, lista gradjevina, etc.)
  - DINAMICNE 
    - menjaju se stalno i potreban je visok fps
    - svaka ovakva komponenta treba da bude nezavisna jedna od druge


*/

