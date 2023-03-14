import * as THREE from 'three';

export default class Beaker extends THREE.Mesh {
  constructor(beaker, reagent) {
    super(
      new THREE.CylinderGeometry(beaker.radius, beaker.radius, beaker.height, beaker.radialSegments, 1, true),
      beaker.material
    );
    this.material.side = THREE.DoubleSide;
    this.material.depthWrite = false;
    this.userData.clickable = true;

    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(beaker.radius - 0.05, beaker.radius - 0.05, 0.1, beaker.radialSegments),
      reagent.material
    );
    liquid.material.depthWrite = false;

    liquid.position.y -= beaker.height * 0.5 - 0.1;
    // if `reagent.amount` is 10 then beaker is filled 10/10, if 7 then 7/10 and so on...
    liquid.position.y += reagent.amount * 0.05;
    liquid.scale.y += reagent.amount;
    this.add(liquid);
  }

  fill() {
    const liquid = this.children[0];
    const missingLiquid = 11 - liquid.scale.y;

    if (missingLiquid > 0) {
      liquid.position.y += missingLiquid * 0.05;
      liquid.scale.y += missingLiquid;

      return true;
    }

    return false;
  }

  reduceLiquidby1Unit() {
    const liquid = this.children[0];

    if (liquid.scale.y > 1) {
      liquid.scale.y -= 1;
      liquid.position.y -= 0.05;

      return true;
    }

    return false;
  }

  addLiquidby1Unit() {
    const liquid = this.children[0];

    if (liquid.scale.y < 11) {
      liquid.scale.y += 1;
      liquid.position.y += 0.05;

      return true;
    }

    return false;
  }
}
