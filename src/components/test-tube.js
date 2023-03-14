import * as THREE from 'three';

export default class TestTube extends THREE.Group {
  constructor(testTube) {
    super();
    this.name = 'testTube';

    const testTubeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(testTube.radius, testTube.radius, testTube.height, testTube.radialSegments, 1, true),
      testTube.material
    );
    testTubeBase.material.side = THREE.DoubleSide;
    testTubeBase.material.depthWrite = false;
    testTubeBase.userData.clickable = true;
    this.add(testTubeBase);

    // hemisphere
    const testTubeBottom = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        testTube.radius,
        testTube.radialSegments,
        Math.round(testTube.radialSegments * 0.25),
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.5
      ),
      testTube.material
    );
    testTubeBottom.castShadow = true;

    testTubeBottom.rotation.x = Math.PI;
    testTubeBottom.position.y = -(testTube.height * 0.5);
    testTubeBottom.userData.clickable = true;
    this.add(testTubeBottom);
  }
}
