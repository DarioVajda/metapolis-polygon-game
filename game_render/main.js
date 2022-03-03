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
          intersected.object.material.color.set(0xcccccc);
        }
        intersected = intersects[0];
        intersected.object.material.color.set(0x777777);
      } else {
        if (intersected) {
          intersected.object.material.color.set(0xcccccc);
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
    // console.log(hit.object.name);
    if(hit.object.parent.parent){
      // console.log("x: ",hit.object.parent.parent.gridx);
      // console.log("y: ",(hit.object.parent.parent.position.y));
      // console.log("z: ",hit.object.parent.parent.gridy);
    }
    else{
      // console.log("x: ",hit.object.gridx);
      // console.log("y: ",(hit.object.position.y));
      // console.log("z: ",hit.object.gridy);
      var objectdimensions = statsModule.buildingDimensions.get(Object.values(statsModule.buildingTypes)[guiType.type]);
      var start = new buildingModule.Coordinate(hit.object.gridx, hit.object.gridy);
      var end = new buildingModule.Coordinate(hit.object.gridx+objectdimensions[0][0]-1, hit.object.gridy+objectdimensions[0][1]-1);
      // console.log(start,end);
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
    console.log(buildingModule.getBuildings());
    // console.log("built: ",type);
  }

  function sceneAdd(start,end,elementType,level){
    loader.load( './models/' + elementType + '_placeholder.glb', function ( gltf ) {
      const model = gltf.scene.children[0];
      const wholescene = gltf.scene;
     
      const posX = (end.x+start.x)/2;
      // console.log(start.x,end.x)
      const posY = (end.y+start.y)/2;
      
      wholescene.rotateY(Math.PI);

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