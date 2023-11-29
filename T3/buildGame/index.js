import * as THREE from "three";
import { CSG } from "../../libs/other/CSGMesh.js";
import {DragControls} from '../../build/jsm/controls/DragControls.js'

const textureLoader = new THREE.TextureLoader();

const lambertRedMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const lambertGreyMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
const lambertBlueMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const lambertOrangeMaterial = new THREE.MeshLambertMaterial({ color: 0xff8c00 });
const lambertPinkMaterial = new THREE.MeshLambertMaterial({ color: 0xff00f7 });
const lambertGreenMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const lambertYellowMaterial = new THREE.MeshLambertMaterial({ color: 0xeeff00 });
const phongBlueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: "200", specular: "rgb(255, 255, 255)" });
const phongWhiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: "200", specular: "rgb(255, 255, 255)" });

const texture = textureLoader.load("../assets/textures/doubleHitBrick.jpg");
const hitterTexture = textureLoader.load("../assets/textures/hitter.jpg");

const wallThickness = 0.5;
const brickHeight = 0.6;
const brickMargin = 0.12;

export const buildBricks = (baseScenario, fase, gameWidth) => {
  let bricks;

  switch (fase) {
    case 1:
      bricks = [
        ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
        ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
      ]
      break;
    case 2:
      bricks = [
        ['C', 'O', 'G', 'P', '', 'O', 'G', 'B', 'C'],
        ['B', 'G', 'O', 'R', '', 'G', 'O', 'C', 'B'],
        ['G', 'P', 'R', 'O', '', 'B', 'C', 'O', 'G'],
        ['O', 'R', 'P', 'G', '', 'C', 'B', 'G', 'O'],
        ['R', 'O', 'G', 'B', '', 'O', 'G', 'P', 'R'],
        ['P', 'G', 'O', 'C', '', 'G', 'O', 'R', 'P'],
        ['G', 'B', 'C', 'O', '', 'P', 'R', 'O', 'G'],
        ['O', 'C', 'B', 'G', '', 'R', 'P', 'G', 'O'],
        ['C', 'O', 'G', 'P', '', 'O', 'G', 'B', 'C'],
        ['B', 'G', 'O', 'R', '', 'G', 'B', 'C', 'B'],
        ['G', 'P', 'R', 'O', '', 'B', 'C', 'O', 'G'],
        ['O', 'R', 'P', 'G', '', 'C', 'B', 'G', 'O'],
        ['R', 'O', 'G', 'B', '', 'O', 'G', 'P', 'R'],
        ['P', 'G', 'O', 'C', '', 'G', 'O', 'R', 'P']
      ]
      break;
    case 3:
      bricks = [
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'Y', 'O', 'Y', 'O', 'Y', 'O', 'Y', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B'],
        ['O', '', 'Y', '', 'Y', '', 'Y', '', 'Y', '', 'O'],
        ['B', '', 'R', '', 'G', '', 'G', '', 'R', '', 'B']
      ]
      break;
  }

  let bricksMatrix = [];

  let biggestLine = 0;
  bricks.forEach(line => biggestLine = biggestLine > line.length ? biggestLine : line.length);

  let brickWidth = ((gameWidth) - (2 * wallThickness)) / (biggestLine + (biggestLine * brickMargin));

  const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 1);

  const initilPositionX = (0 - gameWidth / 2) + brickWidth + wallThickness / 2;
  const initilPositionY = (0 + gameWidth) - brickHeight;

  bricks.forEach((lineLine, line) => {
    let brickRow = []
    lineLine.forEach((brick, column) => {

      let material;
      let name = brick;

      switch (brick) {
        case 'C':
          material = lambertGreyMaterial;
          material.map = texture;
          break;
        case 'R':
          material = lambertRedMaterial;
          break;
        case 'B':
          material = lambertBlueMaterial;
          break;
        case 'O':
          material = lambertOrangeMaterial;
          break;
        case 'P':
          material = lambertPinkMaterial;
          break;
        case 'G':
          material = lambertGreenMaterial;
          break;
        case 'Y':
          material = lambertYellowMaterial;
          break;
      }

      if (brick != "") {
        brick = new THREE.Mesh(brickGeometry, material);

        if (material === lambertGreyMaterial) {
          brick.doubleHit = true;
        }

        if (material === lambertYellowMaterial) {
          brick.indestructible = true;
        }

        if (brick && material) {
          brick.position.x = initilPositionX + (column * (brickWidth + brickMargin));
          brick.position.y = initilPositionY - (line * (brickHeight + brickMargin));
          brick.position.z = 0.8;

          brick.castShadow = true;

          baseScenario.add(brick);

          brickRow.push(brick);

          brick.name = name;
        }
      }
    })

    bricksMatrix.push(brickRow);
  })

  return { bricksMatrix, brickWidth };
}

export const buildGame = (baseScenario, gameWidth, fase, isMobile, camera, renderer) => {
  const buildBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.2);

    const ball = new THREE.Mesh(ballGeometry, phongWhiteMaterial);

    ball.translateY((1.64 * gameWidth) / -2);

    ball.position.z = 20;

    baseScenario.add(ball);

    ball.castShadow = true;

    ball.ignoreColision = false;

    return ball;
  };

  const buildWalls = () => {
    const verticalWallGeometry = new THREE.BoxGeometry(
      wallThickness,
      2 * gameWidth,
      3.5
    );
    const horizontalWallGeometry = new THREE.BoxGeometry(
      gameWidth,
      wallThickness,
      3.5
    );

    const leftWall = new THREE.Mesh(verticalWallGeometry, lambertBlueMaterial);
    const topWall = new THREE.Mesh(horizontalWallGeometry, lambertBlueMaterial);
    const rightWall = new THREE.Mesh(verticalWallGeometry, lambertBlueMaterial);

    leftWall.translateX(gameWidth / -2 + wallThickness / 2);
    topWall.translateY(gameWidth);
    rightWall.translateX(gameWidth / 2 - wallThickness / 2);

    const wallsArray = [leftWall, rightWall, topWall];

    wallsArray.forEach((item) => {
      baseScenario.add(item);
      item.castShadow = true;
    });

    return wallsArray;
  };

  const buildHitter = (isMobile, camera) => {
    let auxMobileHitter;



    if (isMobile) {
      const geometry = new THREE.BoxGeometry(2, 6, 2);  
      auxMobileHitter = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }) );
      auxMobileHitter.position.set(0, 0, 0)
      baseScenario.add(auxMobileHitter);
      new DragControls([auxMobileHitter], camera, renderer.domElement);
    }

    const cylinderGeometry = new THREE.CylinderGeometry(10, 10, 0.8);
    const boxGeometry = new THREE.BoxGeometry(20, 0.8, 20);

    const cylinder = new THREE.Mesh(cylinderGeometry, phongBlueMaterial);
    const rectangle = new THREE.Mesh(boxGeometry, phongBlueMaterial);

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

    const hitterMaterial = phongBlueMaterial;
    hitterMaterial.map = hitterTexture;
    hitter.material = hitterMaterial;

    hitter.position.set(0, 0, 0);
    hitter.translateY((3.1 * gameWidth) / -2);
    hitter.translateZ(0.8);

    hitter.rotateX(THREE.MathUtils.degToRad(90));

    hitter.name = "hitter";
    hitter.userData.radius = 10;
    hitter.userData.width = 1.20;
    hitter.userData.height = 0.15;
    hitter.castShadow = true;

    baseScenario.add(hitter);

    return ({hitter, auxMobileHitter});
  }

  const wallsArray = buildWalls();
  const hitterObject = buildHitter(isMobile, camera);
  const ball = buildBall();
  const { bricksMatrix, brickWidth } = buildBricks(baseScenario, fase, gameWidth);

  return {
    hitter: hitterObject.hitter,
    auxiliar: hitterObject.auxMobileHitter,
    ball,
    wallsArray,
    bricksMatrix,
    brickWidth
  };
};
