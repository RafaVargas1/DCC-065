import * as THREE from "three";

import { initRenderer, onWindowResize, InfoBox } from "../libs/util/util.js";
import { perspectiveCameraInitialization } from "./Utils/PerspectiveCamera/index.js";
import { lightInitialization } from "./Utils/Light/index.js";
import { setupBackground } from './setupBackground/index.js';
import { buildGame } from './buildGame/index.js';
import { checkGame } from "./checkGame/index.js";
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";
import { ballMovementHandler, aditionalBallMovementHandler } from "./ballHandler/index.js";
import {
  wallColisionHandler,
  aditionalWallColisionHandler,
  brickColisionHandler,
  aditionalBrickColisionHandler,
  hitterColisionHandler,
  aditionalHitterColisionHandler,
  floorColisionHandler,
  aditionalFloorColisionHandler
} from "./colisionHandler/index.js";
import { powerUpMovement, removePowerUp, pickUpPowerUp, checkPowerUp } from "./powerUpHandler/index.js";

const startVelocity = 0.25;
const time = 15;
let resultantVelocity = .125;
const multiplyFactor = Math.pow(2, 1/(4*time));
let elapsedTime = 0;
let timesIncreased = 1;

let speedInfoBox = null;

const handleTextBallVelocity = () => {    
  if (speedInfoBox)
    speedInfoBox.infoBox.remove()

  speedInfoBox = new InfoBox();

  const textBallVelocity = "Velocidade " + resultantVelocity;
  speedInfoBox.add(textBallVelocity)
  speedInfoBox.show();
}

const scene = new THREE.Scene();

const renderer = initRenderer();

const canvas = renderer.domElement;

const gameWidth = 14;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
let actualStage = 1;

const mustInitialize = new Event("initialize");
const changeStage = new Event("changeStage");

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
    initializeGame(true);
    actualStage = 1;
  },
  false
);

window.addEventListener(
  "changeStage",
  () => {
    if (actualStage == 1) {
      actualStage = 2;
    } else {
      actualStage = 1;
    };

    initializeGame();
  },
  false
);

const camera = perspectiveCameraInitialization(screenWidth, screenHeight);

const [backgroundContainer, backgroundContent] = setupBackground(screenWidth, screenHeight, gameWidth, scene);

lightInitialization(scene);

let ball,
  aditionalBall,
  wallsArray,
  bricksMatrix,
  hitter,
  brickWidth,
  ballPosition,
  ballVelocity,
  gameStart,
  gameRunning,
  gameFinish,
  powerUpAvailable,
  brickCounter,
  hadColission,
  powerUp,
  powerUpPosition,
  aditionalBallPosition,
  aditionalBallVelocity,
  colissionDetected;

const initializeGame = (mustReset = false) => {
  let components;

  if (mustReset) {
    components = buildGame(backgroundContent, gameWidth, 1);
  } else {
    components = buildGame(backgroundContent, gameWidth, actualStage);
  }

  ball = components.ball;
  wallsArray = components.wallsArray;
  bricksMatrix = components.bricksMatrix;
  hitter = components.hitter;
  brickWidth = components.brickWidth;

  ballPosition = ball.position;
  ballVelocity = new THREE.Vector3(0.0, 0.0, 0);
  gameStart = false;
  gameRunning = false;
  gameFinish = false;
  powerUpAvailable = true;
  brickCounter = 0;
  hadColission = false;
  powerUp = null;
  powerUpPosition = null;
  aditionalBall = null;
  aditionalBallPosition = null;
  aditionalBallVelocity = null;
  colissionDetected = false;
};

initializeGame();

const onMouseClick = () => {
  if (!gameRunning && !gameStart && !gameFinish) {
    elapsedTime = 0;
    gameStart = true;
    gameRunning = true;
    ballVelocity = new THREE.Vector3(0, startVelocity, 0);
  }
};

const colissionTimer = () => {
  if (hadColission) {
    setTimeout(() => {
      hadColission = false;
    }, 100);
  }
}

const resetColission = () => {
  if (colissionDetected) {
    colissionDetected = false;
  }
}

const render = () => {
  requestAnimationFrame(render);

  colissionTimer();

  ({ powerUpAvailable } = checkPowerUp(aditionalBall));
  ({ aditionalBall, aditionalBallPosition, aditionalBallVelocity } = pickUpPowerUp(
    powerUp,
    powerUpPosition,
    hitter,
    backgroundContent,
    ballPosition,
    ballVelocity,
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity
  ));
  ({ powerUpAvailable } = removePowerUp(
    powerUp,
    powerUpPosition,
    backgroundContent,
    gameWidth,
    powerUpAvailable
  ));
  ({ powerUpPosition } = powerUpMovement(
    powerUp,
    powerUpPosition,
    gameRunning
  ));

  ({ gameRunning } = keyboardUpdate(
    canvas,
    gameRunning,
    gameStart,
    backgroundContent,
    mustInitialize,
    changeStage
  ));

  ({ gameRunning, gameStart, gameFinish } = checkGame(
    bricksMatrix,
    gameRunning,
    gameStart,
    gameFinish,
    actualStage,
    changeStage,
    backgroundContent
  ));

  ({ ballPosition, elapsedTime, ballVelocity, timesIncreased } = ballMovementHandler(
    ball,
    ballPosition,
    ballVelocity,
    time,
    elapsedTime,
    multiplyFactor,
    startVelocity,
    timesIncreased,
    gameRunning,
    gameStart,
    hitter,
    gameFinish
  ));
  ({ aditionalBallPosition } = aditionalBallMovementHandler(
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    gameRunning, 
    time, 
    elapsedTime, 
    multiplyFactor, 
    startVelocity, 
    timesIncreased
  ));

  ({ ballVelocity } = wallColisionHandler(ball, wallsArray, ballVelocity));
  ({ aditionalBallVelocity } = aditionalWallColisionHandler(aditionalBall, wallsArray, aditionalBallVelocity));

  ({ ballVelocity, colissionDetected } = hitterColisionHandler(ball, ballVelocity, hitter, colissionDetected));
  ({ aditionalBallVelocity } = aditionalHitterColisionHandler(aditionalBall, aditionalBallVelocity, hitter));

  ({
    ballVelocity,
    powerUpAvailable,
    brickCounter,
    hadColission,
    powerUp,
    powerUpPosition
  } = brickColisionHandler(
    ball,
    bricksMatrix,
    ballVelocity,
    backgroundContent,
    powerUpAvailable,
    brickCounter,
    hadColission,
    brickWidth,
    powerUp,
    powerUpPosition
  ));
  ({
    aditionalBallVelocity,
    powerUpAvailable,
    brickCounter,
    hadColission,
    powerUp,
    powerUpPosition
  } = aditionalBrickColisionHandler(
    aditionalBall,
    bricksMatrix,
    aditionalBallVelocity,
    backgroundContent,
    powerUpAvailable,
    brickCounter,
    hadColission,
    brickWidth,
    powerUp,
    powerUpPosition
  ));

  ({
    ballVelocity,
    gameRunning,
    gameStart,
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity
  } = floorColisionHandler(
    ball,
    ballVelocity,
    gameWidth,
    gameRunning,
    hitter,
    gameStart,
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    backgroundContent
  ));
  ({ aditionalBall, aditionalBallPosition, aditionalBallVelocity } = aditionalFloorColisionHandler(
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    gameWidth,
    backgroundContent
  ));

  handleTextBallVelocity();

  resultantVelocity = Math.sqrt(Math.pow(ballVelocity.y,2) + Math.pow(ballVelocity.x, 2)).toFixed(3);

  resetColission();

  renderer.render(scene, camera);
};

render();
