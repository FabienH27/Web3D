import * as THREE from 'three';

export const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const fov = 50;
const ratio = window.innerWidth / window.innerHeight;
const znear = 0.25;
const zfar = 100;

export const camera = new THREE.PerspectiveCamera(fov, ratio, znear, zfar);
camera.position.set(- 1.8, 0.6, 1000);