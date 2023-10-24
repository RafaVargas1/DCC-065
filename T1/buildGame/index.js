import * as THREE from "three";
import { CSG } from "../../libs/other/CSGMesh.js";

const lambertRedMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const lambertGreyMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
const lambertBlueMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const lambertOrangeMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });
const lambertPinkMaterial = new THREE.MeshLambertMaterial({ color: 0xff00f7 });
const lambertGreenMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const phongBlueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

const wallThickness = 0.5;
const brickHeight = 0.8;
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
      }

      if (brick != "") {
        brick = new THREE.Mesh(brickGeometry, material);

      if (material === lambertGreyMaterial) {
        brick.specialType = true;
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

export const buildGame = (baseScenario, gameWidth, fase) => {
  const buildBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.2);

    const ball = new THREE.Mesh(ballGeometry, phongBlueMaterial);

    ball.translateY((1.525 * gameWidth) / -2);

    ball.position.z = 20;

    baseScenario.add(ball);

    ball.castShadow = true;

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

  const buildHitter = () => {
    const hitterRadius = (0.225 * gameWidth) / 2;

    const cylinderGeometry = new THREE.CylinderGeometry(hitterRadius, hitterRadius, brickHeight);
    const boxGeometry = new THREE.BoxGeometry(3, 10, 10);

    const cylinder = new THREE.Mesh(cylinderGeometry, lambertBlueMaterial);
    const rectangle = new THREE.Mesh(boxGeometry, lambertBlueMaterial);

    cylinder.position.copy(new THREE.Vector3(0, 0, 0));
    rectangle.position.copy(new THREE.Vector3(2, 0, 0));

    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();
    let cylinderCSG = CSG.fromMesh(cylinder);

    rectangle.matrixAutoUpdate = false;
    rectangle.updateMatrix();
    let rectangleCSG = CSG.fromMesh(rectangle);

    let hitterCSG = cylinderCSG.intersect(rectangleCSG);

    let hitter = CSG.toMesh(hitterCSG, new THREE.Matrix4());

    hitter.material = lambertBlueMaterial;

    hitter.position.set(0, 0, 0);
    hitter.translateY((1.775 * gameWidth) / -2);
    hitter.translateZ(0.8);

    hitter.rotateY(THREE.MathUtils.degToRad(90));
    hitter.rotateZ(THREE.MathUtils.degToRad(90));

    hitter.name = "hitter";
    hitter.castShadow = true;

    hitter.geometry.scale(0.5, 1, 1);

    baseScenario.add(hitter);

    return hitter;
  }
  //const buildHitter = () => {
  //  const hitterSize = 0.225 * gameWidth;
  //
  //  const hitterGeometry = new THREE.BoxGeometry(0, 0, 0);
  //  const hitter = new THREE.Mesh(hitterGeometry, lambertBlueMaterial);
  //
  //  const hitterPartsGeometry = new THREE.BoxGeometry(hitterSize / 5, 0.5, 1);
  //  let hitterParts;
  //
  //  let aux = -2;
  //  for (let i = 0; i < 5; i++) {
  //    hitterParts = new THREE.Mesh(hitterPartsGeometry, lambertBlueMaterial);
  //
  //    hitter.add(hitterParts);
  //
  //    hitterParts.translateX((hitterSize / 5) * aux);
  //    aux++;
  //  }
  //
  //  hitter.translateY((1.5 * gameWidth) / -2);
  //
  //  hitter.name = "hitter";
  //
  //  baseScenario.add(hitter);
  //
  //  hitter.castShadow = true;
  //
  //  return hitter;
  //};

  const wallsArray = buildWalls();
  const hitter = buildHitter();
  const ball = buildBall();
  const { bricksMatrix, brickWidth } = buildBricks(baseScenario, fase, gameWidth);

  return {
    hitter,
    ball,
    wallsArray,
    bricksMatrix,
    brickWidth
  };
};
