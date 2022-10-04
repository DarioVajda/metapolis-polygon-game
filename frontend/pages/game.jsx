import React, { useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { OrbitControls, Bounds } from "@react-three/drei";
import Link from "next/link";
import Buildings from "../components/game/Buildings";
import styles from "../components/styles/Game.module.css";

//----COMPONENTS----//
import Lights from "../components/game/Lights";
import WorldCanvas from "../components/game/WorldCanvas";
import Landscape from "../components/game/modelComponents/ValleyLandscape";
import HTMLContent from "../components/game/HTMLContent";
import Grid from "../components/game/Grid";
import HoverObject from "../components/game/HoverObject.jsx";
import { ID } from "../components/game/GridData";
import { ethers } from "ethers";
import { generateUUID } from "three/src/math/MathUtils";
import FloatingMenu from "../components/game/FloatingMenu";

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
      <Link href="/">
        <a>Home</a>
      </Link>{" "}
      <Link href="/leaderboard">
        <a>Leaderboard</a>
      </Link>{" "}
      <div className={styles.rowWrapper}>
        <div>
          Lorem ipsum dolor sit amet consectetur <br />
          adipisicing elit. Totam natus culpa, id
          <br />
          voluptatem possimus nihil, laboriosam corrupti quas
          <br /> dolorem voluptas soluta vitae accusantium quo,
          <br /> facilis laudantium in. Mollitia, expedita deserunt.
        </div>
        <div className={styles.gameContainer}>
          <HTMLContent ID={ID} />
          <WorldCanvas style={{ width: "100%", height: "100%", display: "block" }}>
            <OrbitControls />
            <Lights />
            <Grid ID={ID} />
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1}>
                {/* <Landscape scale={120} position={[-20, -23, 2]} /> */}
                <FloatingMenu style={{ backgroundColor: "transparent" }} />
                <Buildings ID={ID}></Buildings>
                <HoverObject />
              </Bounds>
            </Suspense>
          </WorldCanvas>
        </div>
        <div>
          Lorem ipsum dolor sit amet consectetur <br />
          adipisicing elit. Totam natus culpa, id
          <br />
          voluptatem possimus nihil, laboriosam corrupti quas
          <br /> dolorem voluptas soluta vitae accusantium quo,
          <br /> facilis laudantium in. Mollitia, expedita deserunt.
        </div>
      </div>
      Lorem ipsum dolor sit amet consectetur <br />
      adipisicing elit. Totam natus culpa, id
    </div>
  );
};
///CAMERA IS BROKEN BECAUSE OF MODELS, THEIR SCALE BREAKS STUFF

export default gameplay;
