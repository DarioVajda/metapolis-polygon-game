import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class ViewGL{
  constructor(canvasRef) {
    let width = window.innerWidth * 0.6;
    let height = window.innerHeight * 0.6;
    // let height = width;
    // console.log(height, width);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: false,
    //   alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.update();
  }

  // ******************* PUBLIC EVENTS ******************* //
  updateValue(value) {
    // Whatever you need to do with React props
  }

  onMouseMove() {
    // Mouse moves
  }

  onWindowResize(vpW, vpH) {
    let width = window.innerWidth * 0.6;
    let height = window.innerHeight * 0.6;
    this.renderer.setSize(width, height);
    // console.log(width);
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    this.camera.position.setZ(25);
  }

  // ******************* RENDER LOOP ******************* //
  update(t) {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    // this.controls.update();
  }
}
