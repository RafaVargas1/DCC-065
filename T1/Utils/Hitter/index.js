import * as THREE from 'three';
import { OrbitControls } from '../../../build/jsm/controls/OrbitControls.js';
import { initRenderer, initCamera, initDefaultBasicLight, setDefaultMaterial, InfoBox, onWindowResize } from "../../../libs/util/util.js";
import { CSG } from '../../../libs/other/CSGMesh.js';

let scene, renderer, camera, material, light, orbit;

scene = new THREE.Scene();
renderer = initRenderer();
camera = initCamera(new THREE.Vector3(0, 15, 30));
material = setDefaultMaterial();
light = initDefaultBasicLight(scene);
orbit = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

export const buildHitter = () => {
    const cylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.8);
    const boxGeometry = new THREE.BoxGeometry(2, 10, 10);
    
    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    const rectangle = new THREE.Mesh(boxGeometry, material);
    
    cylinder.position.copy(new THREE.Vector3(0, 0, 0));
    rectangle.position.copy(new THREE.Vector3(0.5, 0, 0));
    
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();
    let cylinderCSG = CSG.fromMesh(cylinder);
    
    rectangle.matrixAutoUpdate = false;
    rectangle.updateMatrix();
    let rectangleCSG = CSG.fromMesh(rectangle);
    
    let hitterCSG = cylinderCSG.subtract(rectangleCSG);
    
    let hitter = CSG.toMesh(hitterCSG, new THREE.Matrix4());
    
    hitter.material = new THREE.MeshPhongMaterial({ color: 'lightgreen' });
    
    hitter.position.set(0, 0, 0);
    
    hitter.rotateY(THREE.MathUtils.degToRad(90)); 
    hitter.rotateZ(THREE.MathUtils.degToRad(-90)); 
    
    return hitter;
}

const hitter = buildHitter();

scene.add(hitter);

let controls = new InfoBox();

controls.add("- Left button to rotate");
controls.add("- Right button to translate (pan)");
controls.add("- Scroll to zoom in/out.");
controls.show();

render();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}