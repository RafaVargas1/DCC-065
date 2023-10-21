import * as THREE from "three";

import {
  initRenderer,
  onWindowResize,
  initDefaultBasicLight,
} from "../libs/util/util.js";
import { orthographicCameraInitialization } from "./Utils/OrthographicCamera/index.js";
import { perspectiveCameraInitialization } from "./Utils/PerspectiveCamera/index.js";
import { lightInitialization } from "./Utils/Light/index.js";
import { setupBackground } from "./setupBackground/index.js";
import { buildGame } from "./buildGame/index.js";
import { checkGame } from "./checkGame/index.js";
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";
import { ballMovementHandler } from "./ballHandler/index.js";
import {
  wallColisionHandler,
  brickColisionHandler,
  hitterColisionHandler,
  floorColisionHandler,
} from "./colisionHandler/index.js";

const scene = new THREE.Scene();

const renderer = initRenderer();

const canvas = renderer.domElement;

const gameWidth = 14;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const mustInitialize = new Event("initialize");

window.addEventListener(
  "resize",
  () => {
    onWindowResize(camera, renderer, 30);
  },
  false
);

window.addEventListener(
  "click",
  () => {
    onMouseClick();
  },
  false
);

window.addEventListener(
  "mousemove",
  (event) => {
    onMouseMove(
      event,
      backgroundContent,
      camera,
      gameRunning,
      gameStart,
      gameFinish
    );
  },
  false
);

window.addEventListener(
  "initialize",
  () => {
    initializeGame();
  },
  false
);

//const camera = orthographicCameraInitialization(screenWidth, screenHeight);
const camera = perspectiveCameraInitialization(screenWidth, screenHeight);
const [backgroundContainer, backgroundContent] = setupBackground(
  screenWidth,
  screenHeight,
  gameWidth,
  scene
);

lightInitialization(scene);

//initDefaultBasicLight(scene);

let ball,
  wallsArray,
  bricksMatrix,
  hitter,
  ballPosition,
  ballVelocity,
  gameStart,
  gameRunning,
  gameFinish;

const initializeGame = () => {
  let components = buildGame(backgroundContent, gameWidth);

  ball = components.ball;
  wallsArray = components.wallsArray;
  bricksMatrix = components.bricksMatrix;
  hitter = components.hitter;

  ballPosition = ball.position;
  ballVelocity = new THREE.Vector3(0.0, 0.0, 0);
  gameStart = false;
  gameRunning = false;
  gameFinish = false;
};

initializeGame();

const onMouseClick = () => {
  if (!gameRunning && !gameStart && !gameFinish) {
    gameStart = true;
    gameRunning = true;
    ballVelocity = new THREE.Vector3(0, 0.25, 0);
  }
};

const render = () => {
  requestAnimationFrame(render);
  ({ gameRunning } = keyboardUpdate(
    canvas,
    gameRunning,
    gameStart,
    backgroundContent,
    mustInitialize
  ));
  ({ gameRunning, gameStart, gameFinish } = checkGame(
    bricksMatrix,
    gameRunning,
    gameStart,
    gameFinish
  ));

  ({ ballPosition } = ballMovementHandler(
    ball,
    ballPosition,
    ballVelocity,
    gameRunning,
    gameStart,
    hitter,
    gameFinish
  ));
  ({ ballVelocity } = wallColisionHandler(ball, wallsArray, ballVelocity));
  ({ ballVelocity } = hitterColisionHandler(ball, ballVelocity, hitter));
  ({ ballVelocity } = brickColisionHandler(
    ball,
    bricksMatrix,
    ballVelocity,
    backgroundContent
  ));
  ({ ballVelocity, gameRunning, gameStart } = floorColisionHandler(
    ball,
    ballVelocity,
    gameWidth,
    gameRunning,
    hitter,
    gameStart
  ));

  renderer.render(scene, camera);
};

render();
