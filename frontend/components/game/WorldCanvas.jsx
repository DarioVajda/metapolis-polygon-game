//setting up the canvas
import {Canvas} from "@react-three/fiber";
import * as THREE from 'three';

function WorldCanvas(props){
    return(
      <Canvas
      {...props}
      shadows
      onCreated={({ gl ,scene, camera }) => {
        gl.outputEncoding = THREE.sRGBEncoding
        scene.background = new THREE.Color('#373740')
        camera.lookAt([0,0,0])
        gl.shadowMap.type= THREE.PCFSoftShadowMap;
      }}
      camera={{fov:75, position:[10,7,11], near:0.1, far:5000}}>
      </Canvas>
    )
  }

  export default WorldCanvas;