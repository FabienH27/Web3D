import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const fov = 60;
const ratio = window.innerWidth / window.innerHeight;
const znear = 0.25;
const zfar = 100;

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(fov, ratio, znear, zfar);
camera.position.set(- 1.8, 0.6, 1000);


export function render() {
    renderer.render(scene, camera);
}

export function addControls(){
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 30;
    controls.target.set(0, 0, - 0.2);
    controls.update();
}
export function addEnvironment(){
    new THREE.TextureLoader()
    .load('/textures/equirectangular/env.jpg', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;

        render();
    });
}