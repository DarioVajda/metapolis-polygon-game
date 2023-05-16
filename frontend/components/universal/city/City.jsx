import React from 'react'
import { useState, useEffect, useRef } from 'react';

import { OrbitControls, Bounds } from "@react-three/drei"

import styles from './city.module.css';

import { plotSize } from '../../game/MapData';

import WorldCanvas from '../../game/WorldCanvas';
import Lights from '../../game/Lights';
import Grid from '../../game_marko/Grid';
import Buildings from '../../game/Buildings/Buildings';

import BuildingList from './BuildingList';
import Landscape from './Landscape';
import Render from './Render';

const City = ({ id, dataArg, rotation, details, showDelay, fps, pixelRatio }) => {
  
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
      // let r = 0;
      let r = Math.PI / 12;

      while(exists) {
        // break;
        if(!groupRef.current) {
          await delay(10);
          continue;
        }

        r += rotation / 1000 * 2;
        groupRef.current.rotation.y = r;

        if(rotation === 0) break;
      
        await delay(20);
      }
    }

    update();
    
    return () => {
      console.log('destroyed component');
      exists = false;
  }
  });

  console.log({dataArg});

  if(data && waited) return (
    <div className={styles.city}>
      <WorldCanvas position={[0, 220, 220]} pixelRatio={window.devicePixelRatio} >
        <Render fpsMax={fps?fps:30} />
        <Lights/>
        <group ref={groupRef} position={[ dataArg.dimensions.x * plotSize / 2, 0, dataArg.dimensions.y * plotSize / 2]}>
          <group position={[ -dataArg.dimensions.x * plotSize / 2, 0, -dataArg.dimensions.y * plotSize / 2]}>
            <Landscape />
            {/* <BuildingList data={data} /> */}
            <Buildings id={id} data={data} prefixID={`prefix${id}_`} />
          </group>
        </group>
      </WorldCanvas>
    </div>
  )
  else return (
    <></>
  )

}

export default City