import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { addControls, addEnvironment, camera, renderer, scene } from '../setup';

const raycaster = new THREE.Raycaster();

const factor = 0.1;

interface Suzanne extends THREE.Mesh {
    speed: THREE.Vector3;
}

let suzannes: Suzanne[] = [];

window.addEventListener('resize', onWindowResize);
window.addEventListener('pointermove', setPickPosition);

function init() {

    addEnvironment();

    addControls();

    for (let index = 0; index < 50; index++) {
        addSuzanne(Math.random(), Math.random(), Math.random());
    }

    const area = new THREE.Mesh(new THREE.BoxGeometry(22,22,22));

    scene.add(new THREE.BoxHelper(area, 0xffff00))

    animate();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    updateSuzannes();

    for (let i = 0; i < suzannes.length; i++) {
        const cubeA: Suzanne = suzannes[i];
        for (let j = i + 1; j < suzannes.length; j++) {
            const cubeB: Suzanne = suzannes[j];
            const boxA: THREE.Box3 = new THREE.Box3().setFromObject(cubeA);
            const boxB: THREE.Box3 = new THREE.Box3().setFromObject(cubeB);
            if (boxA.intersectsBox(boxB)) {
                cubeA.speed.multiplyScalar(-1);
                cubeB.speed.multiplyScalar(-1);
            }
        }
    }

    renderer.render(scene, camera);
}

function updateSuzannes() {
    suzannes.forEach(sz => {
        sz.position.add(sz.speed);
        if (sz.position.x < -10 || sz.position.x > 10) {
            sz.speed.x = -sz.speed.x;
        }
        if (sz.position.y < -10 || sz.position.y > 10) {
            sz.speed.y = -sz.speed.y;
        }
        if (sz.position.z < -10 || sz.position.z > 10) {
            sz.speed.z = -sz.speed.z;
        }
    })
    
}


function addSuzanne(px: number, py: number, pz: number) {
    var colorandom = new THREE.Color(0xffffff);
    colorandom.setHex(Math.random() * 0xffffff);

    const loader = new GLTFLoader().setPath('/models/gltf/');

    let suzanne: THREE.Object3D = new THREE.Object3D();

    loader.load('suzanne.glb', function (gltf) {
        suzanne = gltf.scene.children[0];
        (suzanne as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: colorandom });

        //Position
        suzanne.position.set((px - 0.5) * 20, (py - 0.5) * 20, (pz - 0.5) * 20);

        (suzanne as Suzanne).speed = new THREE.Vector3(
            px * factor - 0.05,
            py * factor - 0.05,
            pz * factor - 0.05
        );

        (suzanne as THREE.Mesh).geometry.computeBoundingBox();
        scene.add(suzanne);
        suzannes.push(suzanne as Suzanne);
    });

    return suzanne;
}

function setPickPosition(event: { clientX: number; clientY: number; }) {
    const pos = { x: 0, y: 0 } as THREE.Vector2;
    pos.x = (event.clientX / window.innerWidth) * 2 - 1;
    pos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // cast a ray through the frustum
    raycaster.setFromCamera(pos, camera);

}

init();