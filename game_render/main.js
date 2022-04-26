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
camera.position.setX(120);
// camera.position.setX(120);
camera.position.setY(120);
camera.lookAt(0,0,0);            //points camera at (0,0,0)
const gridDimensions = 100;
const gridSize = 10;
const plotSize = gridDimensions/gridSize;

//SETTING UP RENDERER SHADOWS
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


//for mouse
let raycaster = new THREE.Raycaster(); // create once
let mouse = new THREE.Vector2(); // create once
let intersected;

// GUI SETUP
const datGui  = new GUI({ autoPlace: true });
datGui.domElement.id = 'gui' ;
let buildFolder = datGui.addFolder('Build');
let guiType={type:0 };  
buildFolder.add(guiType,'type',0,2,1);
buildFolder.open();

// LANDSCAPE MODEL
loader.load( './models/valley_lanscape2.glb', function ( gltf ) {
  gltf.scene.name='landscape';
  gltf.scene.position.set(-20,-23,2);
  // gltf.scene.rotateY(Math.PI)
  gltf.scene.scale.multiplyScalar(120);
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
} );

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
let hoverObject;
let buildOffset=new Vector3(0,0,0);
let offsetDimensions;
let change=1;  //to fix some weird bug where it spawns a lot of objects on holding gui
buildFolder.__controllers[0].onChange(()=>{
  if(change)
  {
    change=0;
    offsetDimensions = statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
    buildOffset=new Vector3(plotSize*(offsetDimensions[0][0]/2)-plotSize/2,0,plotSize*(offsetDimensions[0][1]/2)-plotSize/2);
    // console.log(buildOffset);

    scene.remove(hoverObject);
      loader.load( './models/' + Object.values(statsModule.buildingTypes)[guiType.type] + '_placeholder.glb', function ( gltf ) {
        const wholescene = gltf.scene;
        hoverObject=wholescene;
        wholescene.scale.multiplyScalar(0.5/3);

        gltf.scene.name='hoverObject';
        gltf.scene.buildingType=Object.values(statsModule.buildingTypes)[guiType.type];
        scene.add( gltf.scene );
        change=1;
      }, undefined, function ( error ) {
        console.error( error );
      } );
  }
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

let currCoordinate;
let prevCoordinate;
let moving = false;

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
        // console.log("hit");
      }
    }
    if(!intersects[obj]) return;
    let hit=intersects[obj];
    let objectdimensions = statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
    let start = new buildingModule.Coordinate(hit.object.gridx, hit.object.gridy);
    let end = new buildingModule.Coordinate(hit.object.gridx+objectdimensions[0][0]-1, hit.object.gridy+objectdimensions[0][1]-1);
    let buildType = Object.values(statsModule.buildingTypes)[guiType.type];
    build(start,end,buildType);
	},
  false );

// R-CLICK - DEMOLISH
document.addEventListener(
  "mousedown",
  event => {
    if(event.button===2)
    {
      mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );

      let intersects = raycaster.intersectObjects(scene.children);
      let obj = -1;
      for (let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.name == 'gridSquare') {
          obj = i;
          // console.log("hit");
        }
      }
      if(!intersects[obj]) return;
      let hit=intersects[obj];
      demolish(hit.object.gridx,hit.object.gridy);
  }
  },
  false );


  function build(start,end,type){
    let occupied=find(start,end);
    if(!(start.x<0 || end.x>=gridSize || start.y<0 || end.y>=gridSize) && occupied===undefined)
    {
      buildingModule.addBuilding(new buildingModule.Building(start, end, type, 0));
      sceneAdd(start,end,type,0);
    } 
    else /// COOL COLOR CUBE TO RED AND BACK
    {
      const posX = (end.x+start.x)/2;
      const posY = (end.y+start.y)/2;

      let cubedimensions =statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
      let cube=new THREE.BoxGeometry(plotSize*cubedimensions[0][0],plotSize*(cubedimensions[0][0]>cubedimensions[0][1]?cubedimensions[0][0]:cubedimensions[0][1]),plotSize*cubedimensions[0][1],1,1,1);
      let cubemat = new THREE.MeshBasicMaterial({color: 0xcc5555,opacity:0.5,transparent:true, side: THREE.DoubleSide})
      let errorCube= new THREE.Mesh(cube,cubemat);
      errorCube.position.set(plotSize*posX-gridSize*plotSize/2+plotSize/2 , errorCube.geometry.parameters.height/2, plotSize*posY-gridSize*plotSize/2-plotSize/2);
      scene.add(errorCube);
      delay(1000).then(() => {
        scene.remove(errorCube);
      });
    }
    
    // console.log(buildingModule.buildingList);
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

/// FUNCTION  TO REMOVE A BUILDING IN THE MAP
function demolish(x,y)
{
  let occupied=find(new buildingModule.Coordinate(x,y),new buildingModule.Coordinate(x,y))
  if(!(occupied===undefined)) //IF OCCUPIED
  {
    scene.children.forEach(element => {
      if(element.gridx)
      {
        if(element.gridx==occupied.start.x && element.gridy==occupied.start.y && element.name!='gridSquare')
        {
          scene.remove(element);
        }
      }
    });
    buildingModule.buildingList.splice(buildingModule.buildingList.findIndex(element => element==occupied),1);
  }

}

/// FUNCTION TO FIND A BUILDING, IF IT EXISTS --- RETURNS UNDEFINED IF DOESNT EXIST
function find(start,end) {
  var found=undefined;

  buildingModule.buildingList.forEach(element => {
    for (let i = start.x; i <= end.x; i++) {
      for(let j = start.y; j<=end.y;j++){
        // console.log(i-element.start.x>=0, element.end.x-i>=0, j-element.start.y>=0, element.end.y-j>=0)
        if(i-element.start.x>=0 && element.end.x-i>=0 && j-element.start.y>=0 && element.end.y-j>=0){
          found=element;
        }
      }
    }
  })
  return found;
}

// LIGHTS //
const ambientLight = new THREE.AmbientLight(0xFFFFFF,0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xF3FFE3,1);
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