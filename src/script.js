import './style.css';

import * as THREE from 'three';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as CONSTANTS from './constants.js';
import { Materials } from './materials';
import Beaker from './components/beaker.js';
import TestTube from './components/test-tube.js';
import TestTubeStand from './components/test-tube-stand.js';

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper());

// Loaders
const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

// Raycaster
let raycaster = new THREE.Raycaster();
let INTERSECTED = null;

// Cursor
const cursor = { x: 0, y: 0 };
const pointer = new THREE.Vector2();

// Groups
const labTableGroup = new THREE.Group();
const pipetteGroup = new THREE.Group();

// tools measurements
const labTableWidth = 15;
const labTableHeight = 6;
const labTableDepth = 0.4;

const beakerHeight = 1.35;
const beakerRadius = 0.55;

const testTubeHeight = 2.4;
const testTubeRadius = 0.25;

// Textures
let envPlaneTexture = null;

function GLTFModelCastsShadow(gltfScene) {
  gltfScene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/**
 * GLTF Models Loading
 */
//loading manager
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
loadingManager.onLoad = function () {
  // console.log('Loading complete!');
};
loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
loadingManager.onError = function (url) {
  console.log('There was an error loading ' + url);
};
//apple
gltfLoader.load('models/Apple/apple.glb', (gltf) => {
  GLTFModelCastsShadow(gltf.scene);
  const appleGroup = gltf.scene.children[0];
  appleGroup.scale.set(4, 4, 4);
  appleGroup.position.set(-4, 0.18, 2.3);
  // gui.add(appleGroup.position, 'x').min(- 3).max(3).step(0.01).name('appleGroup pos x')
  // gui.add(appleGroup.position, 'y').min(- 3).max(3).step(0.01).name('appleGroup pos y')
  // gui.add(appleGroup.position, 'z').min(- 3).max(3).step(0.01).name('appleGroup pos z')
  appleGroup.rotation.set(-0.25, 1.23, 1.38);
  // gui.add(appleGroup.rotation, 'x').min(- 3).max(3).step(0.01).name('appleGroup rot x')
  // gui.add(appleGroup.rotation, 'y').min(- 3).max(3).step(0.01).name('appleGroup rot y')
  // gui.add(appleGroup.rotation, 'z').min(- 3).max(3).step(0.01).name('appleGroup rot z')
  scene.add(appleGroup);
});
// Frappe
gltfLoader.load('models/frappe.glb', (gltf) => {
  GLTFModelCastsShadow(gltf.scene);
  const frappeGroup = gltf.scene.children[0];
  frappeGroup.scale.set(4, 4, 4);
  frappeGroup.position.set(5, 0, 2);
  // gui.add(frappeGroup.position, 'x').min(- 3).max(3).step(0.01).name('frappeGroup x')
  // gui.add(frappeGroup.position, 'y').min(- 3).max(3).step(0.01).name('frappeGroup y')
  // gui.add(frappeGroup.position, 'z').min(- 3).max(3).step(0.01).name('frappeGroup x')
  frappeGroup.castShadow = true;
  scene.add(frappeGroup);
});
// Laptop
gltfLoader.load('models/laptop.glb', (gltf) => {
  GLTFModelCastsShadow(gltf.scene);
  const laptopGroup = gltf.scene.children[0];
  laptopGroup.scale.set(4, 4, 4);
  laptopGroup.rotation.set(0, -0.5, 0);
  laptopGroup.position.set(3, 0, 0);
  laptopGroup.castShadow = true;
  scene.add(laptopGroup);
});

/**
 * Environment map
 */
// Vertical Plane in the distance with sun-set texture
textureLoader.load(
  'textures/sunset-scenery.jpg',
  function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    envPlaneTexture = new THREE.MeshPhongMaterial({
      map: texture,
    });
    // Env Plane
    const envPlaneGroup = new THREE.Group();
    scene.add(envPlaneGroup);
    const envPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(156, 92, 512), envPlaneTexture);
    envPlane.position.z = -50;
    envPlaneGroup.add(envPlane);
  },
  undefined,
  function (err) {
    console.error('An error happened.');
  }
);
// Sun-set cube map
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.png',
  'textures/environmentMaps/0/nx.png',
  'textures/environmentMaps/0/py.png',
  'textures/environmentMaps/0/ny.png',
  'textures/environmentMaps/0/pz.png',
  'textures/environmentMaps/0/nz.png',
]);
environmentMap.encoding = THREE.sRGBEncoding;
// scene.background = environmentMap
scene.environment = environmentMap;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

//light from the sunset
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 55;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-7, 2, -50);
scene.add(directionalLight);
// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

//lab table
scene.add(labTableGroup);
const labTableGeometry = new THREE.BoxBufferGeometry(labTableWidth, labTableHeight, labTableDepth);
const labTable = new THREE.Mesh(labTableGeometry, Materials.labTable);
labTable.receiveShadow = true;
labTable.rotation.x = -Math.PI * 0.5;
labTable.position.y -= labTableDepth * 0.5;
labTableGroup.add(labTable);
//invisible vertical plane to lock pipette on
const invisPlane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(labTableWidth * 2, labTableHeight),
  new THREE.MeshStandardMaterial({ color: 0x000000, visible: false })
);
invisPlane.name = 'invisPlane';
invisPlane.position.y = labTableHeight * 0.5;
scene.add(invisPlane);
/**
 * pipette
 */
scene.add(pipetteGroup);
const pipettePlasticHeight = 1;
//rubber part
const pipetteRubber = new THREE.Mesh(
  new THREE.SphereGeometry(0.13, CONSTANTS.RADIAL_SEGMENTS, 16),
  Materials.pipetteRubber
);
pipetteRubber.castShadow = true;
pipetteRubber.position.y = pipettePlasticHeight;
pipetteGroup.add(pipetteRubber);
//plastic part
const pipettePlastic = new THREE.Mesh(
  new THREE.CylinderGeometry(0.04, 0.016, pipettePlasticHeight, CONSTANTS.RADIAL_SEGMENTS, 1, true),
  Materials.glass.clone()
);
pipettePlastic.castShadow = true;
pipettePlastic.position.y = pipettePlasticHeight * 0.5;
pipetteGroup.add(pipettePlastic);
/**
 * Test Tube Stand
 */
const testTubeStand = new TestTubeStand(
  new TestTube({
    radius: testTubeRadius,
    height: testTubeHeight,
    radialSegments: CONSTANTS.RADIAL_SEGMENTS,
    clickable: true,
    material: Materials.glass,
  }),
  { amount: 1, material: Materials.transparentReagent }
);
testTubeStand.position.x = -2;
scene.add(testTubeStand);

let reagentSelected = '';
let reagentSampleClickedBefore = false;
function addToReagent() {
  if (reagentSampleHeight <= 2.2) {
    if (reagentSelected == 'NaOH') {
      // increase reagent with red
      if (!reagentSampleClickedBefore) {
        reagentSample.material.color.setRGB(0, 0, 0);
        reagentSampleClickedBefore = true;
      }

      reagentSample.material.color.r += 0.1;
      reagentSample.material.color.g = 0;
      reagentSample.material.color.b -= 0.02;
      if (reagentSample.material.color.r > 1) reagentSample.material.color.r = 1;
      if (reagentSample.material.color.b < 0) reagentSample.material.color.b = 0;

      reagentSample.material.opacity += 0.01;
      reagentSampleHeight += 0.1;
      reagentSample.geometry.dispose();
      reagentSample.geometry = new THREE.CylinderGeometry(
        reagentSampleRadius,
        reagentSampleRadius,
        reagentSampleHeight,
        CONSTANTS.RADIAL_SEGMENTS
      );
      reagentSample.position.y += 0.05;

      // decrease red reagent amount
      NaOHBeaker.reduceLiquidby1Unit();
    } else if (reagentSelected == 'CuCl2') {
      // increase reagent with blue
      if (!reagentSampleClickedBefore) {
        reagentSample.material.color.setRGB(0, 0, 0);
        reagentSampleClickedBefore = true;
      }

      reagentSample.material.color.r -= 0.02;
      reagentSample.material.color.g = 0;
      reagentSample.material.color.b += 0.1;
      if (reagentSample.material.color.r < 0) reagentSample.material.color.r = 0;
      if (reagentSample.material.color.b > 1) reagentSample.material.color.b = 1;

      reagentSample.material.opacity += 0.01;
      reagentSampleHeight += 0.1;
      reagentSample.geometry.dispose();
      reagentSample.geometry = new THREE.CylinderGeometry(
        reagentSampleRadius,
        reagentSampleRadius,
        reagentSampleHeight,
        CONSTANTS.RADIAL_SEGMENTS
      );
      reagentSample.position.y += 0.05;

      // decrease blue reagent amount
      CuCl2Beaker.reduceLiquidby1Unit();
    }
  }
}

function resetReagent() {
  // reset geometry
  reagentSampleHeight = 0.1;
  reagentSample.geometry.dispose();
  reagentSample.geometry = new THREE.CylinderGeometry(
    reagentSampleRadius,
    reagentSampleRadius,
    reagentSampleHeight,
    CONSTANTS.RADIAL_SEGMENTS
  );
  reagentSample.position.y = CONSTANTS.TUBE_RADIUS * 0.9 + 0.5;
  // reset color
  reagentSample.material.opacity = 0.16;
  reagentSample.material.color.setRGB(1, 1, 1);
  reagentSampleClickedBefore = false;
  // reset pipette
  reagentSelected = '';
  pipettePlastic.material.color.setHex(0xb5b5b5);
  // reset red/blue liquids
  CuCl2Beaker.fill();
  NaOHBeaker.fill();
}
/**
 * NaOH(red, basic) Beaker
 */
const NaOHBeaker = new Beaker(
  {
    radius: beakerRadius,
    height: beakerHeight,
    radialSegments: CONSTANTS.RADIAL_SEGMENTS,
    material: Materials.glass.clone(),
  },
  { amount: 10, material: Materials.redLiquid }
);
NaOHBeaker.castShadow = true;
NaOHBeaker.position.x = 0.5;
NaOHBeaker.position.y = beakerHeight * 0.5;
scene.add(NaOHBeaker);
NaOHBeaker.onclick = () => {
  reagentSelected = 'NaOH';
  pipettePlastic.material.color.setHex(0xff0000);
};
/**
 * CuCl2(blue, acidic) Beaker
 */
const CuCl2Beaker = new Beaker(
  {
    radius: beakerRadius,
    height: beakerHeight,
    radialSegments: CONSTANTS.RADIAL_SEGMENTS,
    material: Materials.glass.clone(),
  },
  { amount: 10, material: Materials.blueLiquid }
);
CuCl2Beaker.castShadow = true;
CuCl2Beaker.position.x = 2;
CuCl2Beaker.position.y = beakerHeight * 0.5;
scene.add(CuCl2Beaker);
CuCl2Beaker.onclick = () => {
  reagentSelected = 'CuCl2';
  pipettePlastic.material.color.setHex(0x0000ff);
};
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100);
camera.position.y = 3;
camera.position.z = 11;
camera.lookAt(new THREE.Vector3(0, 2, 0));
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // update custom camera controls
  const parallaxX = cursor.x * 4;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 6 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 10 * deltaTime;
  camera.lookAt(new THREE.Vector3(0, 2, 0));
  camera.updateMatrixWorld();

  // find intersections
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // update pipette on inivPlane y-axis
    for (let i of intersects) {
      if (i.object.name === 'invisPlane') {
        pipetteGroup.position.x = i.point.x;
        pipetteGroup.position.y = i.point.y;
      }
    }
    // update hovered as green
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED && INTERSECTED.userData.clickable) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;

      if (INTERSECTED.userData.clickable) {
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0x00ff00);
      }
    }
  } else {
    // update greened materials back to original
    if (INTERSECTED && INTERSECTED.userData.clickable) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Test Tube Stand 1
 */
let testTubeStand1 = new TestTubeStand(
  new TestTube({
    radius: testTubeRadius,
    height: testTubeHeight,
    radialSegments: CONSTANTS.RADIAL_SEGMENTS,
    clickable: false,
    material: Materials.glass.clone(),
  }),
  { amount: 10, material: Materials.purpleLiquid }
);
testTubeStand1.rotation.y = -0.5;
testTubeStand1.position.x = -3.3;
testTubeStand1.position.z = 1.6;
scene.add(testTubeStand1);

// tube on the ground
const tubeOnGroundGroup = new TestTube({
  radius: testTubeRadius,
  height: testTubeHeight,
  radialSegments: CONSTANTS.RADIAL_SEGMENTS,
  clickable: false,
  material: Materials.glass.clone(),
});
tubeOnGroundGroup.rotation.x = 1.5;
tubeOnGroundGroup.rotation.z = 1;
tubeOnGroundGroup.position.x = -4;
tubeOnGroundGroup.position.y = 0.225;
tubeOnGroundGroup.position.z = -1.2;
scene.add(tubeOnGroundGroup);

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('mousemove', (event) => {
  // for camera damping
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;

  // for object intersects
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// let arrow = null
window.addEventListener(
  'mousedown',
  (event) => {
    event.preventDefault();

    if (event.which === 3) {
      // right click
      resetReagent();
      return;
    } else if (event.which === 2) {
      // scroll wheel click
      return;
    } else if (event.which === 1) {
      // left click
      // cast ray downwards if beaker is below fill it with reagent
      const rayOrigin = new THREE.Vector3();
      pipetteGroup.getWorldPosition(rayOrigin);
      const rayDir = pipetteGroup.up.clone().multiplyScalar(-1);
      raycaster.set(rayOrigin, rayDir);
      // scene.remove(arrow)
      // arrow = new THREE.ArrowHelper(rayDir, rayOrigin, 12, Math.random() * 0xffffff )
      // scene.add(arrow)
      const modelsBelow = raycaster.intersectObjects(scene.children, false);
      if (modelsBelow.length > 0) {
        modelsBelow.forEach((model) => {
          if (model.object.name === 'activeTestTube' && model.distance > 0) addToReagent();
        });
      }

      if (INTERSECTED) {
        if (INTERSECTED.onclick) INTERSECTED.onclick();
      }
    }
  },
  false
);

window.addEventListener('contextmenu', (event) => event.preventDefault());
