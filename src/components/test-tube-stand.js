import * as THREE from 'three';

import * as CONSTANTS from '../constants.js';
import { Materials } from '../materials';

export default class TestTube extends THREE.Group {
  constructor(testTube, reagent) {
    super();
    this.name = 'testTubeStand';

    // Woood base
    const testTubeWoodHeight = 0.2;
    const testTubeWoodWidth = 2;
    const testTubeWood = new THREE.Mesh(
      new THREE.BoxGeometry(testTubeWoodWidth, testTubeWoodHeight, 1.5),
      Materials.wood
    );
    testTubeWood.castShadow = true;
    testTubeWood.receiveShadow = true;
    testTubeWood.position.y = testTubeWoodHeight * 0.5;
    this.add(testTubeWood);
    // Vertical beam metal holder
    const testTubeRodRadius = 0.04;
    const testTubeVRodHeight = 3.5;
    const testTubeVRod = new THREE.Mesh(
      new THREE.CylinderGeometry(testTubeRodRadius, testTubeRodRadius, testTubeVRodHeight, CONSTANTS.RADIAL_SEGMENTS),
      Materials.metal
    );
    testTubeVRod.castShadow = true;
    testTubeVRod.position.x = -testTubeWoodWidth * 0.25;
    testTubeVRod.position.y = testTubeWoodHeight + testTubeVRodHeight * 0.5;
    this.add(testTubeVRod);
    // Horizontal beam metal holder
    const testTubeHRodHeight = 0.5;
    const testTubeHRod = new THREE.Mesh(
      new THREE.CylinderGeometry(testTubeRodRadius, testTubeRodRadius, testTubeHRodHeight, CONSTANTS.RADIAL_SEGMENTS),
      Materials.metal
    );
    testTubeHRod.castShadow = true;
    testTubeHRod.rotation.z = -Math.PI * 0.5;
    testTubeHRod.position.x = -testTubeWoodWidth * 0.25 + testTubeHRodHeight * 0.5;
    testTubeHRod.position.y = testTubeWoodHeight + testTubeVRodHeight * 0.85;
    this.add(testTubeHRod);
    // Horizontal ring metal holder
    const testTubeMetalHolder = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.04, 6, 32), Materials.metal);
    testTubeMetalHolder.castShadow = true;
    testTubeMetalHolder.rotation.x = -Math.PI * 0.5;
    testTubeMetalHolder.position.x = -testTubeWoodWidth * 0.25 + 0.8;
    testTubeMetalHolder.position.y = testTubeWoodHeight + testTubeVRodHeight * 0.85;
    this.add(testTubeMetalHolder);

    if (testTube) {
      testTube.name = 'activeTestTube';
      testTube.castShadow = true;
      testTube.position.x = -testTubeWoodWidth * 0.25 + 0.8;
      testTube.position.y = 2.4;
      this.add(testTube);
    }

    if (reagent) {
      const reagentMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          CONSTANTS.TUBE_RADIUS * 0.85,
          CONSTANTS.TUBE_RADIUS * 0.85,
          reagent.amount * 0.1,
          CONSTANTS.RADIAL_SEGMENTS
        ),
        reagent.material
      );
      reagentMesh.position.x = -testTubeWoodWidth * 0.25 + 0.8;
      reagentMesh.position.y = 2.4 * 0.5 + reagent.amount * 0.1 * 0.5;
      this.add(reagentMesh);
    }
  }
}
