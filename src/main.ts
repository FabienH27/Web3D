import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { addControls, addEnvironment, camera, render, renderer, scene } from './setup';

let bones: any = [];
let betaAnim = 0;

window.addEventListener('resize', onWindowResize);

function init() {

    addEnvironment();

    // Model
    for (let index = 0; index < 8; index++) {
        addModel(index);
    }
    // addModel();

    addControls();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}

function addModel(index: number) {
    const loader = new GLTFLoader().setPath('/models/gltf/');
    loader.load('Tentacule.glb', function (gltf) {
        const cube = gltf.scene;
        const angle = index * Math.PI * 2 / 8;
        const radius = 5;
        cube.position.set(Math.cos(angle) * radius, cube.position.y, Math.sin(angle) * radius);
        cube.rotateY(angle * -1);
        scene.add(cube);

        let object = cube.getObjectByName("Bone");
        bones.push(object);
        let children = object?.children!;

        while (!(object === undefined || children?.length == 0)) {
            bones.push(children[0]);
            children = children[0].children;
        }

        animate();
    });

    loader.load('Octopus_head.glb', function(gltf){
        const head = gltf.scene;
        const scale = 1.4;
        head.scale.set(scale, scale, scale);
        scene.add(head);
    })

}

function animate() {
    betaAnim += 0.01;
    requestAnimationFrame(animate);
    let changeposition = 0;
    bones.forEach((bone: BoneType) => {
        changeposition += 10 * (Math.PI / 45)
        bone.position.x = 0.2 * Math.sin((changeposition) + betaAnim);
        bone.rotation.z = 0.2 * Math.sin((changeposition) + betaAnim);
    });
    renderer.render(scene, camera);
}



init();