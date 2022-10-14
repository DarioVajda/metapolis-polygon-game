import React, { useRef, useEffect } from 'react'

import { Canvas, useFrame } from "@react-three/fiber";

import { OrbitControls, Bounds, MapControls } from "@react-three/drei";

import City from '../components/universal/city/City';

import WorldCanvas from '../components/game/WorldCanvas';
import Render from '../components/universal/city/Render';
import Lights from '../components/game/Lights';
import Landscape from '../components/universal/city/Landscape';

const ThreeTest = () => {


  // #region temp

  const groupRef = useRef();
  const rotation = 0;

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {

    let exists = true;

    const update = async () => {
      let r = Math.PI / 12;
      // r = 0;

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

  // #endregion */


  return (
    <div style={{width: '35em', height: '35em', border: '2px solid white', display: 'grid' }}>
      {/* <div style={{ gridColumn: 1, gridRow: 1 }}>
        <City id={6} rotation={5} fps={3} pixelRatio={4} />
      </div>
      <div style={{ gridColumn: 1, gridRow: 1, zIndex: 10000 }}>
        <City id={6} rotation={2} fps={30} pixelRatio={4} />
      </div> */}
      <Canvas
        shadows
        onCreated={null}
        camera={{ fov:40, position:[200, 225, 0], near: 0.1, far: 1000, aspect: 1/1 }}
        orthographic={false}
        frameloop='demand'
        dpr={2}
      >
        <Render fpsMax={0.5} />
        <Lights/>
        <MapControls maxDistance={400} minDistance={75} enableDamping={false} enableRotate={false} />
        <group ref={groupRef}>
          <Landscape />
        </group>

        {/* <Canvas
          shadows
          onCreated={null}
          camera={{ fov:40, position:[175, 175, 175], near: 0.1, far: 1000, aspect: 1/1 }}
          orthographic={false}
          frameloop='always'
          dpr={4}
        >
          <Lights/>
          <Landscape />
          <OrbitControls />
        </Canvas> */}

      </Canvas>
    </div>
  )
}

// UNDO-OVATI PROMENE U FAJLOVIMA CITY.MODULE.CSS I CITY.JSX JER SAM TO MENJAO SAMO DA BIH VIDEO DA LI OVO STO SAM PROBAO RADI KAKO TREBA

/*

Map Controls Arguments:
  object, attach, attachArray, attachObject, args, children, key, onUpdate, position, up, scale, rotation, matrix, quaternion, layers, dispose, addEventListener, hasEventListener, removeEventListener, dispatchEvent, onChange, camera, reset, enabled, update, onStart, keys, target, touches, connect, domElement, minDistance, maxDistance, minZoom, maxZoom, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, enableDamping, dampingFactor, enableZoom, zoomSpeed, enableRotate, rotateSpeed, enablePan, panSpeed, screenSpacePanning, keyPanSpeed, autoRotate, autoRotateSpeed, reverseOrbit, mouseButtons, target0, position0, zoom0 , getPolarAngle, getAzimuthalAngle, setPolarAngle, setAzimuthalAngle, getDistance, listenToKeyEvents, saveState, onEnd

plan za igricu:

Landscape
Building list
Hover moving building
Selected building UI
Special effects...

*/

export default ThreeTest