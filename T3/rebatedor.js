import * as THREE from 'three';
import { OrbitControls } from '../../../build/jsm/controls/OrbitControls.js';
import { initRenderer, initCamera, initDefaultBasicLight, setDefaultMaterial, InfoBox, onWindowResize } from "../../../libs/util/util.js";
import { CSG } from '../../../libs/other/CSGMesh.js';
import { MTLLoader } from '../../build/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../../build/jsm/loaders/OBJLoader.js';

let scene, renderer, camera, material, light, orbit;

scene = new THREE.Scene();
renderer = initRenderer();
camera = initCamera(new THREE.Vector3(0, 15, 30));
material = setDefaultMaterial();
light = initDefaultBasicLight(scene);
orbit = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("./assets/textures/hitter.jpg");

export const buildHitter = () => {
    const cylinderGeometry = new THREE.CylinderGeometry(10, 10, 0.8);
    const boxGeometry = new THREE.BoxGeometry(20, 0.8, 20);

    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    const rectangle = new THREE.Mesh(boxGeometry, material);

    cylinder.position.copy(new THREE.Vector3(0, 0, 0));
    rectangle.position.copy(new THREE.Vector3(0, 0, 0.15));

    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();
    let cylinderCSG = CSG.fromMesh(cylinder);

    rectangle.matrixAutoUpdate = false;
    rectangle.updateMatrix();
    let rectangleCSG = CSG.fromMesh(rectangle);

    let hitterCSG = cylinderCSG.subtract(rectangleCSG);

    let hitter = CSG.toMesh(hitterCSG, new THREE.Matrix4());

    const hitterMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    hitterMaterial.map = texture;
    hitter.material = hitterMaterial;

    hitter.position.set(0, 0, 0);

    hitter.rotateX(THREE.MathUtils.degToRad(90));

    return hitter;
}

export const loadModel = (baseScenario) => {
    let spaceship;
    var MTLloader = new MTLLoader();
    var OBJloader = new OBJLoader();

    MTLloader.load("./assets/models/starwars.mtl", function (materials) {
        materials.preload();

        OBJloader.setMaterials(materials);
        OBJloader.load("./assets/models/starwars.obj", function (obj) {
            obj.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            spaceship = obj;

            var mat4 = new THREE.Matrix4();
            spaceship.matrixAutoUpdate = false;
            spaceship.matrix.identity();
            spaceship.matrix.multiply(mat4.makeRotationY(THREE.MathUtils.degToRad(-90)));
            spaceship.matrix.multiply(mat4.makeRotationZ(THREE.MathUtils.degToRad(-90)));
            spaceship.matrix.multiply(mat4.makeTranslation(-8.4, 0, -1.3));
            spaceship.matrix.multiply(mat4.makeScale(1, 1, 1));

            baseScenario.add(spaceship);
        }, null, null);
    }, null, null);
}

const boxGeometry = new THREE.BoxGeometry(0, 0, 0);

const hitterFigure = new THREE.Mesh(boxGeometry, material);

scene.add(hitterFigure);

const hitter = buildHitter();

loadModel(hitterFigure);

hitterFigure.add(hitter);

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