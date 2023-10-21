import * as THREE from "three";


export const buildGame = (baseScenario, gameWidth, fase) => {

  const basicBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const phongBlueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const phongGreyMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const wallThickness = 0.5;
  const brickHeight = 0.8;
  const brickMargin = 0.18;


  const buildBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.2);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.translateY(1.4 * gameWidth / -2);

    baseScenario.add(ball);

    return ball;
  }

  const buildBricksFase1 = () => {
    const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 1);

    const initilPositionX = (0 - gameWidth / 2) + brickWidth + wallThickness / 2;
    const initilPositionY = (0 + gameWidth) - brickHeight;

   const bricksAmount = ((gameWidth - wallThickness) / (brickWidth + 0.36));
    const totalLines = 4;

    let bricksMatrix = [];

    for (let column = 0; column < bricksAmount; column++) {
      let brickRow = [];

      for (let line = 0; line < totalLines; line++) {
        const brick = new THREE.Mesh(brickGeometry, phongBlueMaterial);

        brick.position.x = initilPositionX + (column * (brickWidth + brickMargin));
        brick.position.y = initilPositionY - (line * (brickHeight + brickMargin));

        brickRow.push(brick);

        baseScenario.add(brick);
      }

      bricksMatrix.push(brickRow);
    }

    return bricksMatrix;
  }

  const buildBricksFase2 = () => {
    let bricksMatrix = [];
    const bricks = [
      ['C', 'C', 'B', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'B', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'B', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'B', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'B', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'B', 'B', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', '', 'C', 'C', 'C', 'C']
    ]
    const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 1);

    const initilPositionX = (0 - gameWidth / 2) + brickWidth + wallThickness / 2;
    const initilPositionY = (0 + gameWidth) - brickHeight;


    bricks.forEach( (lineLine, line) => {
      let brickRow = []
      lineLine.forEach( (brick, column) => {
        
        if (brick == 'C'){
          brick = new THREE.Mesh(brickGeometry, phongGreyMaterial);
        } else if (brick == 'B') {
          brick = new THREE.Mesh(brickGeometry, phongBlueMaterial);
        }

        if (brick){
          brick.position.x = initilPositionX + (column * (brickWidth + brickMargin));
          brick.position.y = initilPositionY - (line * (brickHeight + brickMargin));
  
          baseScenario.add(brick);

          brickRow.push(brick)
        }
    


      })

      bricksMatrix.push(brickRow);

    })

    return bricksMatrix;

    //const initilPositionX = (0 - gameWidth / 2) + brickWidth + wallThickness / 2;
    //const initilPositionY = (0 + gameWidth) - brickHeight;

    const bricksAmount = ((gameWidth - wallThickness) / (brickWidth + 0.36));

    const totalLines = 4;

    totalBricks = bricksAmount * totalLines

    //let bricksMatrix = [];
    

    for (let column = 0; column < bricksAmount; column++) {
      let brickRow = [];

      for (let line = 0; line < totalLines; line++) {
        const brick = new THREE.Mesh(brickGeometry, phongBlueMaterial);

        brick.position.x = initilPositionX + (column * (brickWidth + brickMargin));
        brick.position.y = initilPositionY - (line * (brickHeight + brickMargin));

        brickRow.push(brick);

        baseScenario.add(brick);
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
      aux++;
    }

    hitter.translateY(1.5 * gameWidth / -2);

    hitter.name = "hitter";

    baseScenario.add(hitter);

    return hitter;
  }

  const wallsArray = buildWalls();
  const hitter = buildHitter();
  const ball = buildBall();

  let bricksMatrix;

  switch (fase) {
    case 1:
      bricksMatrix = buildBricksFase1();
      break;
    case 2:
      bricksMatrix = buildBricksFase2();
      break;
  }

  return {
    hitter,
    ball,
    wallsArray,
    bricksMatrix
  }



}
