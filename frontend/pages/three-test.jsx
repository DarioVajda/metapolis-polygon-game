import React, { useRef, useEffect } from 'react'

import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';

import City from '../components/universal/city/City';
import { DynamicDrawUsage } from 'three';

const ThreeTest = () => {
  return (
    <div style={{width: '20em', height: '20em', border: '2px solid white'}}>
      <City id={6} rotation={5} />
    </div>
  )
}

export default ThreeTest