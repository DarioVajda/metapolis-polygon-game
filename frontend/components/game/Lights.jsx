import { useRef } from "react";

const shadowMapSize = [256,256]

function Lights(){
    const mesh = useRef()
    return(
      <>
        <ambientLight intensity={0.15} />
        <directionalLight 
          ref={mesh}
          castShadow
          intensity={0.4} 
          position={[200,400,200]} 
          shadow-camera-bottom={-500} 
          shadow-camera-left={-500} 
          shadow-camera-top={500}
          shadow-camera-right={500}
          shadow-camera-far={5000}
          shadow-camera-near={0}
          shadow-mapSize={shadowMapSize}
        />
      </>
    )
  }

export default Lights;