import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/router';


import {OrbitControls, Bounds} from "@react-three/drei"
import Link from "next/link"

//----COMPONENTS----//
import Buildings from '../../components/game/Buildings';
import Lights from '../../components/game/Lights'
import WorldCanvas from '../../components/game/WorldCanvas';
import HTMLContent from '../../components/game/HTMLContent'
import Grid from '../../components/game/Grid';
import HoverObject from '../../components/game/HoverObject.jsx';

import Landscape from '../../components/universal/city/Landscape'



//MAIN COMPONENT
const Gameplay = ({ ID }) => {
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
          {/* <Suspense fallback={null}> */}
            <Bounds fit clip margin={1}>
              <Landscape scale={120} position={[-20,-23,2]}/>
              <Buildings ID={ID} />
              <HoverObject/>
            </Bounds>
          {/* </Suspense> */}
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