import React from 'react'
import { useState, useEffect } from 'react';

import { OrbitControls, Bounds } from "@react-three/drei"

import WorldCanvas from '../../game/WorldCanvas';
import Lights from '../../game/Lights';
import Buildings from '../../game/Buildings';
import Grid from '../../game/Grid';

import BuildingList from './BuildingList';
import Landscape from './Landscape';
import { useRef } from 'react';

const City = ({ id, dataArg, rotation, details, showDelay }) => {
  
  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const [ data, setData ] = useState(dataArg);
  const [ waited, setWaited ] = useState(false);

  const loadData = async () => {
    console.log(`http://localhost:8000/cities/${id}/data`);
    let _data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    setData(_data);
  }

  const groupRef = useRef();

  useEffect(() => {
    if(data === undefined) {
      loadData();
    }

    let exists = true;

    const initialize = async () => {
      await delay(showDelay);
      setWaited(true);
    }
  
    initialize();

    const update = async () => {
      let r = Math.PI / 12;
      if(rotation === 0) return;

      while(exists) {
        // break;
        if(!groupRef.current) {
          await delay(10);
          continue;
        }

        r += rotation / 1000;
        groupRef.current.rotation.y = r;
        // console.log(groupRef.current.rotation);
      
        await delay(10);
      }
    }

    update();
    
    return () => {
      console.log('destroyed component');
      exists = false;
  }
  });

  if(data && waited) return (
    <WorldCanvas rotation={1} >
      <Lights/>
      <group ref={groupRef}>
        <Landscape />
        <BuildingList data={data} />
      </group>
    </WorldCanvas>
  )
  else return (
    <></>
  )

}

export default City