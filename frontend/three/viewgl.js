import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class ViewGL{
  constructor(canvasRef) {
    this.ratio = 3;
    let width = window.innerWidth / this.ratio;
    // let height = window.innerHeight / 1.5;
    let height = width;
    // console.log(height, width);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: false,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.camera.position.setZ(25);

    this.geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    this.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.torus = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.torus);
    this.torus.position.set(0, 0, 0);

    this.pointLight = new THREE.PointLight(0x33ff33);
    this.pointLight.position.set(10, 20, 5);
    this.scene.add(this.pointLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

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
    let width = window.innerWidth / this.ratio;
    let height = width;
    this.renderer.setSize(width, width);
    // console.log(width);
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    this.camera.position.setZ(25);
  }

  // ******************* RENDER LOOP ******************* //
  update(t) {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    // this.controls.update();

    // this.torus.rotation.x += 0.005;
    this.torus.rotation.y += 0.01;
    // this.torus.rotation.z += 0.01;
  }
}
