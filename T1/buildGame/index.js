import * as THREE from "three";


export const buildGame = (baseScenario, gameWidth) => {

  const basicBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const phongBlueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

  const wallThickness = 0.5;
  const brickHeight = 1;
  const brickWidth = 1;
  const brickMargin = 0.15;


  const buildBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.4);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.translateY(1.4 * gameWidth / -2);

    baseScenario.add(ball);

    return ball;
  }

  const buildBricks = () => {
    const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 1);

    const initilPositionX = (0 - gameWidth / 2) + brickWidth + wallThickness / 2;
    const initilPositionY = (0 + gameWidth) - brickHeight;

    const bricksAmount = ((gameWidth - wallThickness) / (brickWidth + 0.3));

    const totalLines = 1;

    let bricksMatrix = [];

    for (let column = 0; column < bricksAmount; column++) {
      let brickRow = [];

      for (let line = 0; line < totalLines; line++) {
        const brick = new THREE.Mesh(brickGeometry, phongBlueMaterial);

        brick.position.x = initilPositionX + (column * (brickWidth + brickMargin));
        brick.position.y = initilPositionY - (line * (brickHeight + brickMargin));
        
        brickRow.push(brick);

        baseScenario.add(brick)
      }

      bricksMatrix.push(brickRow);
    }

    return bricksMatrix;
  }

  const buildWalls = () => {

    const verticalWallGeometry = new THREE.BoxGeometry(wallThickness, 2 * gameWidth, 1);
    const horizontalWallGeometry = new THREE.BoxGeometry(gameWidth, wallThickness, 1);

    const leftWall = new THREE.Mesh(verticalWallGeometry, basicBlueMaterial);
    const topWall = new THREE.Mesh(horizontalWallGeometry, basicBlueMaterial);
    const rightWall = new THREE.Mesh(verticalWallGeometry, basicBlueMaterial);

    leftWall.translateX((gameWidth / -2) + wallThickness / 2);
    topWall.translateY(gameWidth);
    rightWall.translateX((gameWidth / 2) - wallThickness / 2);


    const wallsArray = [leftWall, rightWall, topWall];

    wallsArray.forEach(item => {
      baseScenario.add(item);
    })

    return wallsArray;

  }

  const buildHitter = () => {
    const hitterSize = 0.225 * gameWidth;

    const hitterGeometry = new THREE.BoxGeometry(0, 0, 0);
    const hitter = new THREE.Mesh(hitterGeometry, phongBlueMaterial);

    const hitterPartsGeometry = new THREE.BoxGeometry(hitterSize / 5, 0.5, 1);
    let hitterParts;

    let aux = -2;
    for (let i = 0; i < 5; i++) {
      hitterParts = new THREE.Mesh(hitterPartsGeometry, phongBlueMaterial);
      
      hitter.add(hitterParts);

      hitterParts.translateX(hitterSize / 5 * aux);
      aux ++;
    }

    hitter.translateY(1.5 * gameWidth / -2);

    hitter.name = "hitter";

    baseScenario.add(hitter);

    return hitter;
  }

  const wallsArray = buildWalls();
  const hitter = buildHitter();
  const bricksMatrix = buildBricks();
  const ball = buildBall();

  return {
    hitter,
    ball,
    wallsArray,
    bricksMatrix
  }



}
