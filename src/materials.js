import * as THREE from 'three';

import * as CONSTANTS from './constants.js';

const Materials = {
  labTable: new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.7,
  }),
  wood: new THREE.MeshStandardMaterial({
    color: '#36220a',
    metalness: 0,
    roughness: 1,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: '#7d7c7c',
    metalness: 0.6,
    roughness: 0.2,
  }),
  glass: new THREE.MeshStandardMaterial({
    color: '#b5b5b5',
    metalness: 0.4,
    roughness: 0.2,
    transparent: true,
    opacity: 0.32,
  }),
  pipetteRubber: new THREE.MeshBasicMaterial({ color: 0x292723 }),
  transparentReagent: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.16,
  }),
  redLiquid: new THREE.MeshStandardMaterial({
    color: 'rgba(255, 0, 0)',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.32,
  }),
  blueLiquid: new THREE.MeshStandardMaterial({
    color: 'rgba(0, 0, 255)',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.32,
  }),
};

export { Materials };
