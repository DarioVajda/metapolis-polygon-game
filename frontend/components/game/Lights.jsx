import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper, SpotLightHelper } from "three";

const shadowMapSize = [1024,1024]

function Lights(){
    const mesh = useRef()
    // useHelper(mesh,DirectionalLightHelper,'cyan')
    return(
      <>
        <ambientLight intensity={0.1} />
        <directionalLight ref={mesh} castShadow intensity={0.5} position={[200,400,200]} shadow-camera-bottom={-500} shadow-camera-left={-500} shadow-camera-top={500} shadow-camera-right={500} shadow-camera-far={5000} shadow-camera-near={0} shadow-mapSize={shadowMapSize}/>
        {/* <spotLight ref ={mesh} castShadow color="white" intensity={2} position={[-700, 500, 60]} angle={0.5} shadow-mapSize={shadowMapSize} /> */}
      </>
    )
  }

export default Lights;