import './style.css'
import * as THREE from 'three';
import * as buildingModule from './external/building';
import * as statsModule from './external/building_stats';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshBasicMaterial } from 'three';
import { SphereGeometry } from 'three';
import { GUI } from 'dat.gui'

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
var intersected;

// GUI SETUP
const datGui  = new GUI({ autoPlace: true });
datGui.domElement.id = 'gui' ;
var buildFolder = datGui.addFolder('Build');
var guiType={type:0 };
buildFolder.add(guiType,'type',0,2,1);
buildFolder.open();

// GRID //
//  const gridHelper = new THREE.GridHelper(gridDimensions,gridSize);
//  scene.add(gridHelper);

// GRID SQUARES
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

//*** */ BUILDING SYSTEM ***//
//////////////////////////////
// HOVER HIGHLIGHT
document.addEventListener("mousemove", event=>{
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(scene.children);

  // console.log(scene.children);
  // console.log(intersects);

  //pasted code from an example
  if ( intersects.length > 0 ){
    if(intersects[0].object.parent.parent == null){
      if (intersected != intersects[0].object) {
        if (intersected) {
          intersected.object.material.color.set(0xffff00);
        }
        intersected = intersects[0];
        intersected.object.material.color.set(0xffffff);
      } else {
        if (intersected) {
          intersected.object.material.color.set(0xffff00);
        }
        intersected = null;
      }
    }
  }

// {
//   var hit=intersects[0];
//   hit.object.material.color.set(0xffffff);
// }
},
false );

// L-CLICK - BUILD
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
    if(hit.object.parent.parent){
      console.log("x: ",hit.object.parent.parent.gridx);
      console.log("y: ",(hit.object.parent.parent.position.y));
      console.log("z: ",hit.object.parent.parent.gridy);
    }
    else{
      console.log("x: ",hit.object.gridx);
      console.log("y: ",(hit.object.position.y));
      console.log("z: ",hit.object.gridy);
      var start = new buildingModule.Coordinate(hit.object.gridx, hit.object.gridy);
      var end = new buildingModule.Coordinate(hit.object.gridx, hit.object.gridy);
      var buildType = Object.values(statsModule.buildingTypes)[guiType.type];
      build(start,end,buildType);
    }
    

    //sphere for debugging
    // const geo = new THREE.SphereGeometry(5);
    // const mat = new THREE.MeshBasicMaterial({color:0x0000FF});
    // const sphere = new THREE.Mesh(geo,mat);
    // sphere.position.setX(intersects[0].point.x);
    // // sphere.position.setY(intersects[0].point.y);
    // sphere.position.setZ(intersects[0].point.z);
    // scene.add(sphere);
    // console.log("sphere added at ",intersects[0].point.x);
	}
  },
  false );

  function build(start,end,type){
    buildingModule.addBuilding(new buildingModule.Building(start, end, type, 0));
    sceneAdd(start,end,type,0);
    console.log("built: ",type);
  }

  function sceneAdd(start,end,elementType,level){
    loader.load( './models/' + elementType + '_placeholder.glb', function ( gltf ) {
      const model = gltf.scene.children[0];
  
     
      const posX = (end.x+start.x)/2;
      const posY = (end.y+end.y)/2;

      model.position.set(plotSize*posX-gridSize*plotSize/2+plotSize/2 , 0 , plotSize*posY-gridSize*plotSize/2-plotSize/2);
      console.log(model.position);

      model.scale.multiplyScalar(0.5);

      gltf.scene.name=elementType;
      gltf.scene.gridx=start.x;
      gltf.scene.gridy=start.y;
      gltf.scene.buildingType=elementType;
      scene.add( gltf.scene );
    }, undefined, function ( error ) {
      console.error( error );
    } );
  }

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