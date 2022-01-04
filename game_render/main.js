import './style.css'
import * as THREE from 'three';
import * as buildingModule from './external/building';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// MODEL LOADER //
const loader = new GLTFLoader();

// RENDER/CAMERA INITIALISATION //
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

// SETTING DEFAULT VALUES //
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
camera.position.setZ(120);
// camera.position.setX(120);
camera.position.setY(120);
camera.lookAt(0,0,0);            //points camera at (0,0,0)
const gridDimensions = 200;
const gridSize = 20;
const plotSize = gridDimensions/gridSize;


// GRID //
 const gridHelper = new THREE.GridHelper(gridDimensions,gridSize);
 scene.add(gridHelper);

// ADDING HARDCODED BUILDINGS //
buildingModule.buildingList.forEach(element => {

  const elementType = element.type.type;
  console.log(elementType);

  // loader.load( './models/house_placeholder.glb', function ( gltf ) {
  loader.load( './models/' + elementType + '_placeholder.glb', function ( gltf ) {
    const model = gltf.scene.children[0];

    ////MENANJE VELICINE DA BI POPUNILI ODGOVARAJUCA POLJA
    const sizeX = Math.abs(element.start.x-element.end.x)+1;
    const sizeY = Math.abs(element.start.y-element.end.y)+1;
    const posX = (element.end.x-element.start.x);
    const posY = (element.end.y-element.start.y);
    model.scale.set(model.scale.x*0.5*sizeX,model.scale.y*0.5,model.scale.z*0.5*sizeY);
    model.position.set(element.start.x*plotSize-gridDimensions/2+plotSize/2+plotSize*posX/2 , 0 , element.start.y*plotSize-gridDimensions/2+plotSize/2+plotSize*posY/2);
    /////OVAJ DEO SA MENJANJEM VELICINE JE PRIVREMEN I TREBAO BI BITI ZAMENJEN SAMO VECIM MODELIMA...

    scene.add( gltf.scene );
  }, undefined, function ( error ) {
    console.error( error );
  } );
});

// LIGHTS //
const ambientLight = new THREE.AmbientLight(0xFFFFFF,0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF,0.8);
directionalLight.position.set(100,300,100);
directionalLight.lookAt(0,0,0);
scene.add(directionalLight);


//ANIMATE FUNCTION
 function animate() {
  requestAnimationFrame(animate);


  controls.update();

  renderer.render(scene, camera,);
}

animate();