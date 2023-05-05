import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { addControls, addEnvironment, camera, render, renderer, scene } from '../setup';

const raycaster = new THREE.Raycaster();

const factor = 5;

let suzannes: THREE.Mesh[] = [];

let speeds: number[] = [];
let dirs: number[] = [];
let suzanneBoxes: THREE.Box3[] = [];



let cubesList: THREE.Mesh[] = [];
let cubeBBox: THREE.Box3[] = [];



window.addEventListener('resize', onWindowResize);
window.addEventListener( 'pointermove', setPickPosition );

function init() {

    addEnvironment();

    addControls();

    for (let index = 0; index < 10; index++) {
        // addCube(Math.random() * factor, Math.random() * factor, Math.random() * factor);
        addSuzanne(Math.random() * factor, Math.random() * factor, Math.random() * factor);
        speeds.push(Math.random());
        dirs.push(Math.ceil(Math.random()) * (Math.round(Math.random()) ? 1 : -1));
    }

    animate();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    for(let i = 0; i < suzannes.length; i++) {
        let isIntersecting = false;
        for(let j = i; j < suzannes.length && !isIntersecting; j++) {
            if(i != j) {
                if(suzanneBoxes[i].intersectsBox(suzanneBoxes[j])){
                    isIntersecting = true;
                    //TODO
                    dirs[i] = dirs[i] * -1;
                    suzanneBoxes[i].setFromObject(suzannes[i]);
                }
            }
        }
        let velocity = (speeds[i] + 0.05) * dirs[i] / 10;
        suzannes[i].position.add(new THREE.Vector3(velocity, 0, velocity));

        if(suzannes[i].position.x > 10 || suzannes[i].position.x < -10){
            dirs[i] = dirs[i] * -1;
        }

        if(suzannes[i].position.z > 10 || suzannes[i].position.z < -10){
            dirs[i] = dirs[i] * -1;
        }
    }
    

    renderer.render(scene, camera);
}

init();

function addCube(px: number, py: number, pz: number) {
    var colorandom = new THREE.Color(0xffffff);
    colorandom.setHex(Math.random() * 0xffffff);
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); //x,y,z
    var boxMaterial = new THREE.MeshBasicMaterial({ color: colorandom });
    var cube = new THREE.Mesh(geometry, boxMaterial);

    cube.position.set(px * 2, py * 2, pz * 2);
    cube.geometry.computeBoundingBox(); // null sinon
    scene.add(cube);

    cubesList.push(cube);
    const box = new THREE.Box3().setFromObject(cube);
    cubeBBox.push(box);

    return cube;
}

function addSuzanne(px: number, py: number, pz: number) {
    var colorandom = new THREE.Color(0xffffff);
    colorandom.setHex(Math.random() * 0xffffff);

    const loader = new GLTFLoader().setPath('/models/gltf/');

    let suzanne: THREE.Object3D = new THREE.Object3D();

    loader.load('suzanne.glb', function (gltf) {
        suzanne = gltf.scene.children[0];

        (suzanne as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: colorandom });

        suzanne.position.set(px + Math.floor(Math.random() * 6), py + Math.floor(Math.random() * 6), pz + Math.floor(Math.random() * 6));
        (suzanne as THREE.Mesh).geometry.computeBoundingBox();

        scene.add(suzanne);
        suzannes.push((suzanne as THREE.Mesh));
        suzanneBoxes.push(new THREE.Box3().setFromObject(suzanne));
    });

    return suzanne;
}

function setPickPosition(event: { clientX: number; clientY: number; }) {
    const pos = { x: 0, y: 0 } as THREE.Vector2 ;
    pos.x = (event.clientX / window.innerWidth) * 2 - 1;
    pos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // cast a ray through the frustum
    raycaster.setFromCamera(pos, camera);

}