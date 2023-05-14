import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { addControls, camera, renderer, scene } from '../setup';

const factor = 0.1;

interface Suzanne extends THREE.Mesh {
    speed: THREE.Vector3;
}

let suzannes: Suzanne[] = [];
let lights: THREE.PointLight[] = [];

const lightLeft = new THREE.PointLight(0xff0000, 0.2, 100);
lightLeft.castShadow = true;

window.addEventListener('resize', onWindowResize);

function init() {

    addControls();

    for (let index = 0; index < 20; index++) {
        addSuzanne(Math.random(), Math.random(), Math.random());
    }
    const lightRight = lightLeft.clone();

    const lightTop = lightLeft.clone();

    lightLeft.position.set(-20, 0, 0);
    lightRight.position.set(20, 0, 0);
    lightTop.position.set(0, 20, 0);

    scene.add(lightLeft);
    scene.add(lightRight);
    scene.add(lightTop);

    lights = [lightLeft, lightRight, lightTop];

    play('/sound/song.mp3');

    animate();
}

var audio = document.getElementById("audio") as HTMLAudioElement;
let analyser: any;
let dataArray = new Uint8Array();
function play(e: any) {

    audio.src = e; // URL.createObjectURL(e);
    audio.load();
    // audio.play();

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    var lowerHalfArray: Uint8Array = dataArray.slice(0, (dataArray.length / 2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);
    const averageLower = lowerHalfArray.reduce((p, c) => p + c, 0) / lowerHalfArray.length;
    const averageHigher = upperHalfArray.reduce((p, c) => p + c, 0) / upperHalfArray.length;

    const avg = (averageHigher + averageLower) / 2;
    const pos = avg / 50;

    for (let i = 0; i < suzannes.length; i++) {
        const cubeA: Suzanne = suzannes[i];

        const scale = pos / 1.2;
        cubeA.scale.set(scale, scale, scale);

        (cubeA.material as THREE.MeshStandardMaterial).color.setHSL(scale, scale, 1);
    }

    lights.forEach(l => {
        l.intensity = (pos * pos) * 10;
    });

    renderer.render(scene, camera);
}

function addSuzanne(px: number, py: number, pz: number) {
    var colorandom = new THREE.Color(0xffffff);
    colorandom.setHex(Math.random() * 0xffffff);

    const loader = new GLTFLoader().setPath('/models/gltf/');

    let suzanne: THREE.Object3D = new THREE.Object3D();

    loader.load('suzanne.glb', function (gltf) {
        suzanne = gltf.scene.children[0];
        (suzanne as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 1 });

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

init();