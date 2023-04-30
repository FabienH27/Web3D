import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { camera, renderer } from './setup';

const scene = new THREE.Scene();

let bones: any = [];
let betaAnim = 0;

//Model
const loader = new GLTFLoader().setPath('/models/gltf/');
loader.load('Tentacule.glb', function (gltf) {
    const cube = gltf.scene;
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


function animate() {
    betaAnim += 0.01;
    requestAnimationFrame(animate);
    let changeposition = 0;
    bones.forEach((bone: BoneType) => {
        changeposition += 10 * (Math.PI / 35)
        bone.position.x = 0.3 * Math.sin((changeposition) + betaAnim);
        bone.rotation.z = 0.2 * Math.sin((changeposition) + betaAnim);
    });
    renderer.render(scene, camera);
}

function render() {
    renderer.render(scene, camera);
}

function init() {
    new THREE.TextureLoader()
        .load('/textures/equirectangular/env.jpg', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            render();
        });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 30;
    controls.target.set(0, 0, - 0.2);
    controls.update();
}

init();
animate();
