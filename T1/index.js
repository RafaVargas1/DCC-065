import * as THREE from "three";

import { initRenderer, onWindowResize, initDefaultBasicLight } from "../libs/util/util.js";
import { orthographicCameraInitialization } from "./Utils/OrthographicCamera/index.js";
import { setupBackground } from './Background/index.js'
import { startGame } from './startGame/index.js'

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

const camera = orthographicCameraInitialization(screenWidth, screenHeight);
const [backgroundContainer, backgroundContent] = setupBackground(screenWidth, screenHeight, gameWidth, scene);


startGame(backgroundContent, gameWidth);

const render = () => {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();


