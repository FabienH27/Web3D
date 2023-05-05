import * as THREE from 'three';

// Initialisation de la scène
const scene: THREE.Scene = new THREE.Scene();

// Initialisation de la caméra
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

// Initialisation du renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialisation des cubes et de leurs paramètres
interface Cube extends THREE.Mesh {
  speed: THREE.Vector3;
}

const cubes: Cube[] = [];

for (let i = 0; i < 100; i++) {
  const cubeSize: number = 1;
  const cubeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const cube: Cube = new THREE.Mesh(cubeGeometry, cubeMaterial) as unknown as Cube;
  cube.position.x = (Math.random() - 0.5) * 20;
  cube.position.y = (Math.random() - 0.5) * 20;
  cube.position.z = (Math.random() - 0.5) * 20;
  cube.speed = new THREE.Vector3(
    Math.random() * 0.1 - 0.05,
    Math.random() * 0.1 - 0.05,
    Math.random() * 0.1 - 0.05
  );
  cubes.push(cube);
  scene.add(cube);
}

// Fonction pour détecter les collisions
function detectCollisions() {
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const distance: number = cubes[i].position.distanceTo(cubes[j].position);
      if (distance < cubes[i].scale.x + cubes[j].scale.x) {
        cubes[i].speed.x = -cubes[i].speed.x;
        cubes[i].speed.y = -cubes[i].speed.y;
        cubes[i].speed.z = -cubes[i].speed.z;
        cubes[j].speed.x = -cubes[j].speed.x;
        cubes[j].speed.y = -cubes[j].speed.y;
        cubes[j].speed.z = -cubes[j].speed.z;
      }
    }
  }
}

// Fonction pour mettre à jour la position des cubes
function updateCubes() {
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].position.x += cubes[i].speed.x;
    cubes[i].position.y += cubes[i].speed.y;
    cubes[i].position.z += cubes[i].speed.z;
    if (cubes[i].position.x < -10 || cubes[i].position.x > 10) {
      cubes[i].speed.x = -cubes[i].speed.x;
    }
    if (cubes[i].position.y < -10 || cubes[i].position.y > 10) {
      cubes[i].speed.y = -cubes[i].speed.y;
    }
    if (cubes[i].position.z < -10 || cubes[i].position.z > 10) {
      cubes[i].speed.z = -cubes[i].speed.z;
    }
  }
}

function animate() {
    requestAnimationFrame(animate);
    updateCubes();
    renderer.render(scene, camera);

}

animate();