import './style.css'
import * as THREE from 'three';
import * as buildingModule from './external/building';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshBasicMaterial } from 'three';
import { SphereGeometry } from 'three';
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
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
camera.position.setZ(120);
// camera.position.setX(120);
camera.position.setY(120);
camera.lookAt(0,0,0);            //points camera at (0,0,0)
const gridDimensions = 200;
const gridSize = 20;
const plotSize = gridDimensions/gridSize;

//for mouse
var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once


// GRID //
//  const gridHelper = new THREE.GridHelper(gridDimensions,gridSize);
//  scene.add(gridHelper);

// GRID SQUARES
// const gridSquares = new THREE.Group();
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const plane= new THREE.PlaneGeometry(plotSize-1,plotSize-1);
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const gridSquare = new THREE.Mesh( plane, material );
    gridSquare.position.set(i*plotSize-gridSize/2*plotSize+plotSize/2,0,j*plotSize-gridSize/2*plotSize-plotSize/2);
    gridSquare.rotateX(Math.PI/2);
    gridSquare.name='gridSquare';
    gridSquare.gridx=i;
    gridSquare.gridy=j;
    scene.add(gridSquare);
  }
}
// gridSquares.name="gridSquares";
// scene.add(gridSquares);
/*
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
*/
// BUILDING SYSTEM
/////////////
document.addEventListener(
  "click",
  event => {
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(scene.children);

    // console.log(scene.children);
    // console.log(intersects);
    if ( intersects.length > 0 )
	{
    var hit=intersects[0];
    console.log(hit.object.name);
    console.log("x: ",hit.object.gridx);
    console.log("y: ",(hit.object.position.y));
    console.log("z: ",hit.object.gridy);
    const geo = new THREE.SphereGeometry(5);
    const mat = new THREE.MeshBasicMaterial({color:0x0000FF});
    const sphere = new THREE.Mesh(geo,mat);
    sphere.position.setX(intersects[0].point.x);
    // sphere.position.setY(intersects[0].point.y);
    sphere.position.setZ(intersects[0].point.z);
    scene.add(sphere);
    console.log("sphere added at ",intersects[0].point.x);
	}
  },
  false );

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