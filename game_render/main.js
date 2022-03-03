import './style.css'
import * as THREE from 'three';
import * as buildingModule from './external/building';
import * as statsModule from './external/building_stats';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshBasicMaterial } from 'three';
import { SphereGeometry } from 'three';
import { GUI } from 'dat.gui'
import { Vector2 } from 'three';

// MODEL LOADER //
const loader = new GLTFLoader();



// RENDER/CAMERA INITIALISATION //
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const controls = new OrbitControls(camera, renderer.domElement);

// SETTING DEFAULT VALUES //
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
camera.position.setX(-120);
// camera.position.setX(120);
camera.position.setY(120);
camera.lookAt(0,0,0);            //points camera at (0,0,0)
const gridDimensions = 100;
const gridSize = 10;
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

// LANDSCAPE MODEL
loader.load( './models/valley_lanscape2.glb', function ( gltf ) {
  gltf.scene.name='landscape';
  gltf.scene.position.set(20,-23,-22);
  gltf.scene.rotateY(Math.PI)
  gltf.scene.scale.multiplyScalar(120);
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
} );


// GRID //
//  const gridHelper = new THREE.GridHelper(gridDimensions,gridSize);
//  scene.add(gridHelper);

// GRID SQUARES
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const plane= new THREE.PlaneGeometry(plotSize-1,plotSize-1);
    const material = new THREE.MeshBasicMaterial( {color: 0xcccccc,opacity:0.2,transparent:true, side: THREE.DoubleSide} );
    const gridSquare = new THREE.Mesh( plane, material );
    gridSquare.position.set(i*plotSize-gridSize/2*plotSize+plotSize/2,0,j*plotSize-gridSize/2*plotSize-plotSize/2);
    gridSquare.rotateX(Math.PI/2);
    gridSquare.name='gridSquare';
    gridSquare.gridx=i;
    gridSquare.gridy=j;
    scene.add(gridSquare);
  }
}

//*** */ BUILDING SYSTEM ***//
//////////////////////////////

//_________________________________________________________________________________
// Object following the mouse:

//GUI ONCHANGE
var hoverObject;
var buildOffset=new Vector3(0,0,0);
var offsetDimensions;
buildFolder.__controllers[0].onChange(()=>{
  offsetDimensions = statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
  buildOffset=new Vector3(plotSize*(offsetDimensions[0][0]/2)-plotSize/2,0,plotSize*(offsetDimensions[0][1]/2)-plotSize/2);
  console.log(buildOffset);

  scene.remove(hoverObject);
    loader.load( './models/' + Object.values(statsModule.buildingTypes)[guiType.type] + '_placeholder.glb', function ( gltf ) {
      const wholescene = gltf.scene;
      hoverObject=wholescene;
      wholescene.scale.multiplyScalar(0.5/3);

      gltf.scene.name='hoverObject';
      gltf.scene.buildingType=Object.values(statsModule.buildingTypes)[guiType.type];
      scene.add( gltf.scene );
    }, undefined, function ( error ) {
      console.error( error );
    } );
})
///// SAME FUNCTION BUT INITIALIZING
loader.load( './models/' + Object.values(statsModule.buildingTypes)[guiType.type] + '_placeholder.glb', function ( gltf ) {
  const wholescene = gltf.scene;
  hoverObject=wholescene;
  wholescene.scale.multiplyScalar(0.5/3);

  gltf.scene.name='hoverObject';
  gltf.scene.buildingType=Object.values(statsModule.buildingTypes)[guiType.type];
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
} );

var currCoordinate;
var prevCoordinate;
var moving = false;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function distance(a, b) {
  // console.log((a.x-b.x)**2 + (a.z-b.z)**2);
  return Math.sqrt((a.x-b.x)**2 + (a.z-b.z)**2);
}


function animateTo() {
  if(!currCoordinate || !prevCoordinate) return;
  let d = distance(currCoordinate.position+buildOffset, prevCoordinate.position+buildOffset);
  // console.log('curr: ', currCoordinate, 'prev: ', prevCoordinate, 'd: ', d);

  let r = distance(hoverObject.position, currCoordinate.position+buildOffset);

  // console.log('ratio:', r / d);
  // sad trebam da primenim neke jako kul i komplikovane formule...
  let deltax = currCoordinate.position.x+buildOffset.x - hoverObject.position.x;
  hoverObject.position.setX(hoverObject.position.x + deltax * 0.2);
  let deltaz = currCoordinate.position.z+buildOffset.z - hoverObject.position.z;
  hoverObject.position.setZ(hoverObject.position.z + deltaz * 0.2);

  // console.clear();
  // console.log('currCoordinate', currCoordinate.position);
  // console.log('prevCoordinate', prevCoordinate.position);
  // console.log('dir:', {x: deltax, z: deltaz});

  delay(1000/60).then(() => {
    let epsilon = 0.1;
    if(Math.abs(hoverObject.position.x - currCoordinate.position.x-buildOffset.x) > epsilon || Math.abs(hoverObject.position.z - currCoordinate.position.z-buildOffset.z) > epsilon) animateTo();
    else {
      prevCoordinate = currCoordinate;
      moving = false;
    }
  });
}

// HOVER HIGHLIGHT
document.addEventListener("mousemove", async event => {
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  let intersects = raycaster.intersectObjects(scene.children);
  let obj = -1;
  for (let i = 0; i < intersects.length; i++) {
    if(intersects[i].object.name == 'gridSquare') {
      obj = i;
    }
  }
  if(!intersects[obj]) return;
  obj = intersects[obj].object;
  if(
    currCoordinate && 
    obj.position.x === currCoordinate.position.x && 
    obj.position.z === currCoordinate.position.z
  ) {
    return;
  }
  
  currCoordinate = obj;
  // console.log(currCoordinate.position);
  if(!prevCoordinate) {
    prevCoordinate = currCoordinate;
    // console.log(currCoordinate);
    hoverObject.position.setX(currCoordinate.position.x);
    hoverObject.position.setZ(currCoordinate.position.z);
  }

  if(!moving) {
    moving = true;
    animateTo();
  }
  // console.log(sphere.position);
}, false);
//_________________________________________________________________________________

// L-CLICK - BUILD
document.addEventListener(
  "click",
  event => {
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects(scene.children);
    let obj = -1;
    for (let i = 0; i < intersects.length; i++) {
      if(intersects[i].object.name == 'gridSquare') {
        obj = i;
        console.log("hit");
      }
    }
    if(!intersects[obj]) return;
    var hit=intersects[obj];
    var objectdimensions = statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
    var start = new buildingModule.Coordinate(hit.object.gridx, hit.object.gridy);
    var end = new buildingModule.Coordinate(hit.object.gridx+objectdimensions[0][0]-1, hit.object.gridy+objectdimensions[0][1]-1);
    var buildType = Object.values(statsModule.buildingTypes)[guiType.type];
    build(start,end,buildType);
	},
  false );

  function build(start,end,type){
    buildingModule.addBuilding(new buildingModule.Building(start, end, type, 0));
    sceneAdd(start,end,type,0);
    // console.log("built: ",type);
  }

  function sceneAdd(start,end,elementType,level){
    loader.load( './models/' + elementType + '_placeholder.glb', function ( gltf ) {
      const model = gltf.scene.children[0];
      const wholescene = gltf.scene;
     
      const posX = (end.x+start.x)/2;
      // console.log(start.x,end.x)
      const posY = (end.y+start.y)/2;

      wholescene.position.set(plotSize*posX-gridSize*plotSize/2+plotSize/2 , 0 , plotSize*posY-gridSize*plotSize/2-plotSize/2);
      // console.log(model.position);

      wholescene.scale.multiplyScalar(0.5/3);

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