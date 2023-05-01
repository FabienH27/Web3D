import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { addControls, addEnvironment, camera, render, renderer, scene } from './setup';

let bones = new Map<string, Array<THREE.Object3D | undefined>>();

for (let i = 0; i < 8; i++) {
    bones.set('bone' + (i + 1), []);
}

let betaAnim = 0;

window.addEventListener('resize', onWindowResize);

function init() {

    addEnvironment();
    addModel(0);

    addControls();

    animate();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addModel(index: number) {
    const loader = new GLTFLoader().setPath('/models/gltf/');

    loader.load('Octopus.glb', function (gltf) {
        const octopus = gltf.scene;
        octopus.position.y += 4;
        octopus.scale.multiplyScalar(0.8);
        
        scene.add(octopus);

        for (let i = 0; i < 8; i++) {
            const index = i + 1;
            let tentacle = octopus.getObjectByName("Tent" + index);
            bones.get("bone" + index)?.push(tentacle);
            let children = tentacle?.children!;

            while (!(tentacle === undefined || children?.length == 0)) {
                bones.get("bone" + index)?.push(children[0]);
                children = children[0].children;
            }
        }

    });
}

function animate() {
    betaAnim += 0.05;
    requestAnimationFrame(animate);
    
    let index = 1;
    bones.forEach((tentacle) => {
        let changeposition = 0;
        tentacle.forEach(bone => {
            changeposition += 10 * (Math.PI / 30);            
            bone!.position.z = 0.2 *  Math.sin((changeposition) + betaAnim);
        });
        index++;
    });

    const head = scene.getObjectByName('top_head');
    
    if(head !== undefined){
        head!.position.x = 0.4 * Math.sin(betaAnim);
        head!.position.z = 0.4 * Math.sin(betaAnim);
    }

    renderer.render(scene, camera);
}


init();