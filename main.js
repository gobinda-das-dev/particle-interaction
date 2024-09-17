import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import GUI from 'lil-gui';


class ParticleInteraction {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.initGUI();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initShaders();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('pointermove', this.onMouseMove.bind(this));

    this.initInteractivePlane();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  initShaders() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uPointSize: { value: this.settings.pointSize },
        uInteraction: { value: new THREE.Vector2(0, 0) },
        uStrength: { value: this.settings.strength },
        uRadius: { value: this.settings.radius }
      }
    });

    this.geometry = new THREE.PlaneGeometry(5, 5, 32, 32);
    this.plane = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  initInteractivePlane() {
    this.interactivePlaneGeometry = new THREE.PlaneGeometry(5, 5);
    this.interactivePlaneMaterial = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
    this.interactivePlane = new THREE.Mesh(this.interactivePlaneGeometry, this.interactivePlaneMaterial);
  }

  initGUI() {
    this.gui = new GUI();
    this.settings = {
      pointSize: 100,
      strength: 4,
      radius: 0.3
    }
    
    
    this.gui.add(this.settings, 'pointSize', 1.0, 100.0).onChange((value) => {
      this.material.uniforms.uPointSize.value = value;
    });

    this.gui.add(this.settings, 'strength', 0.0, 10.0).onChange((value) => {
      this.material.uniforms.uStrength.value = value;
    });

    this.gui.add(this.settings, 'radius', 0.0, 1.0).onChange((value) => {
      this.material.uniforms.uRadius.value = value;
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Update coordinates
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.interactivePlane);

    if (intersects.length) {
      const interactions = intersects[0].uv;
      this.material.uniforms.uInteraction.value = interactions;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }
}

new ParticleInteraction();
