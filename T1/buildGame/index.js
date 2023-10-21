import * as THREE from "three";

export const buildGame = (baseScenario, gameWidth) => {
  const lambertBlueMaterial = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
  });
  const phongBlueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

  const wallThickness = 0.5;
  const brickHeight = 0.8;
  const brickWidth = 1.2;
  const brickMargin = 0.18;

  const buildBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.2);

    const ball = new THREE.Mesh(ballGeometry, phongBlueMaterial);

    ball.translateY((1.4 * gameWidth) / -2);

    ball.position.z = 20;

    baseScenario.add(ball);

    ball.castShadow = true;

    return ball;
  };

  const buildBricks = () => {
    const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 0.4);

    const initilPositionX = 0 - gameWidth / 2 + brickWidth + wallThickness / 2;
    const initilPositionY = 0 + gameWidth - brickHeight;

    const bricksAmount = (gameWidth - wallThickness) / (brickWidth + 0.36);

    const totalLines = 4;

    let bricksMatrix = [];

    for (let column = 0; column < bricksAmount; column++) {
      let brickRow = [];

      for (let line = 0; line < totalLines; line++) {
        const brick = new THREE.Mesh(brickGeometry, lambertBlueMaterial);

        brick.position.x =
          initilPositionX + column * (brickWidth + brickMargin);
        brick.position.y = initilPositionY - line * (brickHeight + brickMargin);
        brick.position.z = 0.6;

        brickRow.push(brick);

        brick.castShadow = true;

        baseScenario.add(brick);
      }

      bricksMatrix.push(brickRow);
    }

    return bricksMatrix;
  };

  const buildWalls = () => {
    const verticalWallGeometry = new THREE.BoxGeometry(
      wallThickness,
      2 * gameWidth,
      2
    );
    const horizontalWallGeometry = new THREE.BoxGeometry(
      gameWidth,
      wallThickness,
      2
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
    const hitterSize = 0.225 * gameWidth;

    const hitterGeometry = new THREE.BoxGeometry(0, 0, 0);
    const hitter = new THREE.Mesh(hitterGeometry, lambertBlueMaterial);

    const hitterPartsGeometry = new THREE.BoxGeometry(hitterSize / 5, 0.5, 1);
    let hitterParts;

    let aux = -2;
    for (let i = 0; i < 5; i++) {
      hitterParts = new THREE.Mesh(hitterPartsGeometry, lambertBlueMaterial);

      hitter.add(hitterParts);

      hitterParts.translateX((hitterSize / 5) * aux);
      aux++;
    }

    hitter.translateY((1.5 * gameWidth) / -2);

    hitter.name = "hitter";

    baseScenario.add(hitter);

    hitter.castShadow = true;

    return hitter;
  };

  const wallsArray = buildWalls();
  const hitter = buildHitter();
  const bricksMatrix = buildBricks();
  const ball = buildBall();

  return {
    hitter,
    ball,
    wallsArray,
    bricksMatrix,
  };
};
