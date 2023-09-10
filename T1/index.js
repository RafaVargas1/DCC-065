import * as THREE from "three";

import { initRenderer, onWindowResize, initDefaultBasicLight } from "../libs/util/util.js";
import { orthographicCameraInitialization } from "./Utils/OrthographicCamera/index.js";
import { setupBackground } from './setupBackground/index.js'
import { startGame } from './startGame/index.js'
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";
import { ballMovementHandler } from "./ballHandler/index.js";
import { wallColisionHandler } from "./colisionHandler/index.js";

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


let ballPosition = new THREE.Vector3(0, 0, 0);
let ballVelocity = new THREE.Vector3(0.1, 0.1, 0);


let { ball, wallArray, bricksMatrix, hitter } = startGame(backgroundContent, gameWidth);

const render = () => {
    requestAnimationFrame(render);
    keyboardUpdate(canvas);

    ({ballPosition} = ballMovementHandler( ball, ballPosition, ballVelocity ));
    ({ballVelocity} = wallColisionHandler(ball, wallArray, ballVelocity))
    ({ballVelocity} = hitterColisionHandler(ball, wallArray, ballVelocity))
    
    renderer.render(scene, camera);
};

render();