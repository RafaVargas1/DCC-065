import * as THREE from "three";

import { initRenderer, onWindowResize, initDefaultBasicLight } from "../libs/util/util.js";
import { orthographicCameraInitialization } from "./Utils/OrthographicCamera/index.js";
import { setupBackground } from './setupBackground/index.js'
import { startGame } from './startGame/index.js'
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";

var canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const renderer = initRenderer();

initDefaultBasicLight(scene);

const gameWidth = 14;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer, 30);
    },
    false
);

window.addEventListener(
    'mousemove',
    (event) => {
        onMouseMove(event, backgroundContent, backgroundContainer, camera)
    },
    false
);

const camera = orthographicCameraInitialization(screenWidth, screenHeight);
const [backgroundContainer, backgroundContent] = setupBackground(screenWidth, screenHeight, gameWidth, scene);

startGame(backgroundContent, gameWidth);

const render = () => {
    requestAnimationFrame(render);
    keyboardUpdate(canvas);
    renderer.render(scene, camera);
};

render();