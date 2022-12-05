import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/router';


import {OrbitControls, Bounds} from "@react-three/drei"
import Link from "next/link"

//----COMPONENTS----//
import Buildings from '../../components/game_marko/Buildings';
import Lights from '../../components/game_marko/Lights'
import WorldCanvas from '../../components/game_marko/WorldCanvas';
import HTMLContent from '../../components/game_marko/HTMLContent'
import Grid from '../../components/game_marko/Grid';
import HoverObject from '../../components/game_marko/HoverObject.jsx';

import Landscape from '../../components/universal/city/Landscape'

import Gameplay from '../../components/game/Gameplay';
import { useBuildingStore } from '../../components/game/BuildingStore';


//MAIN COMPONENT
const GameplayOld = ({ ID }) => {
  // getIncome(1)
  return (
    <>
      <div style={{position: "fixed",
        height: '100%',
        width: '100%',
        margin:'0px',
        padding:'0px',
        overflow:'hidden',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <HTMLContent ID={ID} />
        <WorldCanvas>
          <OrbitControls enableDamping={false} />
          <Lights/>
          <Grid ID={ID} />
          <Bounds fit clip margin={1}>
            <Landscape scale={120} position={[-20,-23,2]}/>
            <Buildings ID={ID} />
            <HoverObject/>
          </Bounds>
        </WorldCanvas>
      </div>
      <Link href="/"><a>Home</a></Link> <br />
      <Link href='/leaderboard'><a>Leaderboard</a></Link> <br />
    </>
  )
}















const game = () => {
  const router = useRouter();
  const route = router.query;
  let id;

  const setNumOfNfts = useBuildingStore(state => state.setNumOfNfts);

  const [idValidity, setIdValidity] = useState(0); // 0 - loading, 1 - valid, 2 - not valid

  const isValidID = async () => {
    id = parseInt(id);
    // console.log(id);
    // console.log(typeof id);
    if(typeof id !== 'number') {
      setIdValidity(2);
      return;
    }

    let num = await (await fetch('http://localhost:8000/count')).json();
    num = num.count;
    setNumOfNfts(num);

    if( 
      Object.values(route).length === 1 && 
      route.id != undefined && 
      id >= 0 && 
      id < num
    ) {
      console.log('setIdValidity(1);');
      setIdValidity(1);
    }
    else {
      console.log('setIdValidity(2);');
      setIdValidity(2);
    }
  }

  useEffect(() => {
    if(Object.values(route).length === 0) return;

    console.log(route);
    id = route.id;
    isValidID();

  }, [route]);

  if(idValidity === 0) return (
    <div>Loading...</div>
  )
  else if(idValidity === 1) return (
    <Gameplay ID={route.id} />
  )
  else return (
    <div>Error</div>
  )

  
}

export default game