import * as THREE from "three";

import { initRenderer, onWindowResize, initDefaultBasicLight } from "../libs/util/util.js";
import { orthographicCameraInitialization } from "./Utils/OrthographicCamera/index.js";
import { setupBackground } from './setupBackground/index.js'
import { startGame } from './startGame/index.js'
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";
import { ballMovementHandler } from "./ballHandler/index.js";
import { wallColisionHandler, brickColisionHandler, hitterColisionHandler, floorColisionHandler } from "./colisionHandler/index.js";

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

let { ball, wallsArray, bricksMatrix, hitter } = startGame(backgroundContent, gameWidth);

let ballPosition = ball.position;
let ballVelocity = new THREE.Vector3(0.0, 0.3, 0);

const render = () => {
    requestAnimationFrame(render);
    keyboardUpdate(canvas);

    ({ballPosition} = ballMovementHandler(ball, ballPosition, ballVelocity));
    ({ballVelocity} = wallColisionHandler(ball, wallsArray, ballVelocity));
    ({ballVelocity} = hitterColisionHandler(ball, ballVelocity, hitter));
    ({ballVelocity} = brickColisionHandler(ball, bricksMatrix, ballVelocity, backgroundContent));
    ({ballVelocity} = floorColisionHandler(ball, ballVelocity, gameWidth));
    
    renderer.render(scene, camera);
};

render();