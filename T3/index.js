import * as THREE from "three";

import { initRenderer, onWindowResize } from "../libs/util/util.js";
import { InfoBox } from "./Utils/utils.js";
import { perspectiveCameraInitialization } from "./Utils/PerspectiveCamera/index.js";
import { lightInitialization } from "./Utils/Light/index.js";
import { setupBackground } from './setupBackground/index.js';
import { buildGame } from './buildGame/index.js';
import { checkGame } from "./checkGame/index.js";
import { onMouseMove } from "./hitterMovement/index.js";
import { keyboardUpdate } from "./Utils/Keyboard/index.js";
import { setupAudio } from "./Utils/Audio/index.js";
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
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js'

const startVelocity = 0.15;
const time = 15;
let resultantVelocity = .125;
const multiplyFactor = Math.pow(2, 1 / (4 * time));
let elapsedTime = 0;
let timesIncreased = 1;

const scene = new THREE.Scene();

const renderer = initRenderer();

const canvas = renderer.domElement;

const listener = new THREE.AudioListener();

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
    } else if (actualStage == 2) {
      actualStage = 3;
    } else {
      actualStage = 1;
    }; 

    initializeGame();
  },
  false
);
const initialPositionCamera = new THREE.Vector3(0, -10, 33);
let camera = perspectiveCameraInitialization(screenWidth, screenHeight, initialPositionCamera);

camera.add(listener);

let controls = new OrbitControls(camera, renderer.domElement);

controls.enabled = false
controls.enableZoom = false

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
  colissionDetected,
  mustCheckIgnoreColision,
  lifes = 5,
  activeScreen = true;

let startScreen = document.getElementById("start-screen");
let endScreen = document.getElementById("end-screen");
let button = document.getElementById("start-button");

const { hitterColision, brickColision, doubleHitBrickColision, powerUpBrickColision } = setupAudio(listener);

button.addEventListener("click", () => { onButtonPressed(startScreen) });

const onButtonPressed = (screen) => {
  screen.remove();
  setTimeout(() => {
    activeScreen = false;
  }, 500);
}

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
  mustCheckIgnoreColision = true;
  lifes = mustReset ? 5 : lifes;
};

initializeGame();

const onMouseClick = () => {
  if (!gameRunning && !gameStart && !gameFinish && !activeScreen) {
    elapsedTime = 0;
    gameStart = true;
    gameRunning = true;
    ballVelocity = new THREE.Vector3(0, startVelocity, 0);
    hitterColision.play();
  }
};

const resetColission = () => {
  if (colissionDetected) {
    colissionDetected = false;
  }

  if (hadColission) {
    hadColission = false;
  }
}

const checkIgnoreColision = () => {
  if (ball.ignoreColision && mustCheckIgnoreColision) {
    mustCheckIgnoreColision = false;
    setTimeout(() => {
      ball.ignoreColision = false;
      ball.material = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: "200", specular: "rgb(255, 255, 255)" });
      mustCheckIgnoreColision = true;
    }, 7000);
  }
}

let lifeInfoBox = null;
let speedInfoBox = null;

const handleTextLife = () => {
  if (lifeInfoBox) {
    lifeInfoBox.infoBox.remove();
  }

  if (!activeScreen) {
    lifeInfoBox = new InfoBox(0, 1, 1, 0);

    let textLife = "Vidas: ";

    for (let i = 1; i < lifes + 1; i++) {
      textLife += "♡";

      if (i < lifes) {
        textLife += " ";
      }
    }

    lifeInfoBox.add(textLife);
    lifeInfoBox.show();
  }
}

const handleTextBallVelocity = () => {
  if (speedInfoBox) {
    speedInfoBox.infoBox.remove();
  }

  if (!activeScreen) {
    speedInfoBox = new InfoBox();

    const textBallVelocity = "Velocidade: " + resultantVelocity;

    speedInfoBox.add(textBallVelocity)
    speedInfoBox.show();
  }
}

const checkReset = () => {
  if (lifes == 0) {
    while (backgroundContent.children.length > 0) {
      const object = backgroundContent.children[0];
      backgroundContent.remove(object);
    }
    window.dispatchEvent(mustInitialize);
    gameRunning = false;
  }
}

const checkEnd = () => {
  if (!gameStart && !gameRunning && gameFinish) {
    endScreen.style.setProperty("display", "flex");
    activeScreen = true;
  }
}

const render = () => {
  requestAnimationFrame(render);

  checkEnd();

  checkReset();

  checkIgnoreColision();

  ({ powerUpAvailable } = checkPowerUp(aditionalBall, powerUp, ball));
  ({ aditionalBall, aditionalBallPosition, aditionalBallVelocity, powerUp, powerUpPosition, ball } = pickUpPowerUp(
    powerUp,
    powerUpPosition,
    hitter,
    backgroundContent,
    ballPosition,
    ballVelocity,
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    ball
  ));

  ({ powerUpAvailable, powerUp, powerUpPosition } = removePowerUp(
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

  ({ gameRunning, camera, controls } = keyboardUpdate(
    canvas,
    gameRunning,
    gameStart,
    backgroundContent,
    mustInitialize,
    changeStage,
    camera,
    initialPositionCamera,
    controls,
    renderer
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

  ({ ballVelocity, colissionDetected } = hitterColisionHandler(ball, ballVelocity, hitter, colissionDetected, hitterColision));

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
    powerUpPosition,
    brickColision,
    doubleHitBrickColision,
    powerUpBrickColision
  ));

  ({
    ballVelocity,
    gameRunning,
    gameStart,
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    mustCheckIgnoreColision,
    lifes
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
    backgroundContent,
    mustCheckIgnoreColision,
    lifes
  ));

  ({ aditionalBallVelocity } = aditionalWallColisionHandler(aditionalBall, wallsArray, aditionalBallVelocity));

  ({ aditionalBallVelocity, colissionDetected } = aditionalHitterColisionHandler(aditionalBall, aditionalBallVelocity, hitter, colissionDetected, hitterColision));

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
    powerUp,
    powerUpPosition,
    brickColision,
    doubleHitBrickColision
  ));

  ({ aditionalBall, aditionalBallPosition, aditionalBallVelocity } = aditionalFloorColisionHandler(
    aditionalBall,
    aditionalBallPosition,
    aditionalBallVelocity,
    gameWidth,
    backgroundContent
  ));

  handleTextBallVelocity();

  handleTextLife();

  resultantVelocity = Math.sqrt(Math.pow(ballVelocity.y, 2) + Math.pow(ballVelocity.x, 2)).toFixed(3);

  resetColission();

  renderer.render(scene, camera);
};

render();
