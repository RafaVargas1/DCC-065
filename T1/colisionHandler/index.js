import * as THREE from "three";
import { generatePowerUp } from "../powerUpHandler/index.js";

const lambertNewGreyMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

export const wallColisionHandler = (
  ball,
  wallsMeshArray,
  ballVelocity
) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const calculateWallReflection = (wallIndex) => {
    let normal;

    switch (wallIndex) {
      case 0:
        normal = new THREE.Vector3(-1, 0, 0);
        break;
      case 1:
        normal = new THREE.Vector3(1, 0, 0);
        break;

      case 2:
        normal = new THREE.Vector3(0, -1, 0);
        break;
    }

    const incidentVector = ballVelocity;
    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));
    ballVelocity = reflectionVector;
  };

  const detectWallColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    wallsMeshArray.forEach((wall, wallIndex) => {
      const boxCollided = new THREE.Box3().setFromObject(wall);

      if (boxCollided.intersectsSphere(sphere)) {
        calculateWallReflection(wallIndex);
      }
    });
  };

  if (ball != null && ballVelocity != null) {
    detectWallColision();
  }

  return { ballVelocity };
};

export const aditionalWallColisionHandler = (
  ball,
  wallsMeshArray,
  ballVelocity
) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const calculateWallReflection = (wallIndex) => {
    let normal;

    switch (wallIndex) {
      case 0:
        normal = new THREE.Vector3(-1, 0, 0);
        break;
      case 1:
        normal = new THREE.Vector3(1, 0, 0);
        break;

      case 2:
        normal = new THREE.Vector3(0, -1, 0);
        break;
    }

    const incidentVector = ballVelocity;
    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));
    ballVelocity = reflectionVector;
  };

  const detectWallColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    wallsMeshArray.forEach((wall, wallIndex) => {
      const boxCollided = new THREE.Box3().setFromObject(wall);

      if (boxCollided.intersectsSphere(sphere)) {
        calculateWallReflection(wallIndex);
      }
    });
  };

  if (ball != null && ballVelocity != null) {
    detectWallColision();
  }

  const aditionalBallVelocity = ballVelocity
  return { aditionalBallVelocity };
};

export const floorColisionHandler = (
  ball,
  ballVelocity,
  gameWidth,
  gameRunning,
  hitter,
  gameStart,
  aditionalBall,
  aditionalBallPosition,
  aditionalBallVelocity,
  baseScenario
) => {
  const detectColision = () => {
    if (ball.position.y < (2 * gameWidth) / -2) {
      ball.position.copy(new THREE.Vector3(0.0, (1.64 * gameWidth) / -2, 20));
      ballVelocity = new THREE.Vector3(0.0, 0.0, 0.0);
      gameRunning = false;
      gameStart = false;
      hitter.position.copy(new THREE.Vector3(0.0, (1.775 * 14) / -2, 0.8));

      if (aditionalBall != null) {
        baseScenario.remove(aditionalBall);

        aditionalBall = null;
        aditionalBallPosition = null;
        aditionalBallVelocity = null;
      }
    }
  };

  detectColision();

  return { ballVelocity, gameRunning, gameStart, aditionalBall, aditionalBallPosition, aditionalBallVelocity };
};

export const aditionalFloorColisionHandler = (
  ball,
  ballPosition,
  ballVelocity,
  gameWidth,
  baseScenario
) => {
  const detectColision = () => {
    if (ball.position.y < (2 * gameWidth) / -2) {

      baseScenario.remove(ball);
      ball = null;
      ballPosition = null;
      ballVelocity = null;
    }
  };

  if (ball != null && ballVelocity != null) {
    detectColision();
  }

  const aditionalBall = ball;
  const aditionalBallPosition = ballPosition;
  const aditionalBallVelocity = ballVelocity;

  return { aditionalBall, aditionalBallPosition, aditionalBallVelocity };
};

export const brickColisionHandler = (
  ball,
  bricksMatrix,
  ballVelocity,
  baseScenario,
  powerUpAvailable,
  brickCounter,
  hadColission,
  brickWidth,
  powerUp,
  powerUpPosition
) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const calculateReflection = (side) => {
    let normal;

    if (side != "edge") {
      switch (side) {
        case "up":
          normal = new THREE.Vector3(0, 1, 0);
          break;
        case "down":
          normal = new THREE.Vector3(0, -1, 0);
          break;
        case "left":
          normal = new THREE.Vector3(1, 0, 0);
          break;
        case "right":
          normal = new THREE.Vector3(-1, 0, 0);
          break;
      }

      ballVelocity.reflect(normal);

      if (side == "down") {
        if (ballVelocity.y > 0) {
          ballVelocity.y = -ballVelocity.y
        }
      }
    } else {
      ballVelocity = new THREE.Vector3(
        ballVelocity.x,
        ballVelocity.y * -1,
        ballVelocity.z
      );
    }
  };

  const detectColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    bricksMatrix.forEach((brickRow) => {
      brickRow.forEach((brick) => {
        let brickBox = new THREE.Box3().setFromObject(brick);

        let mustBroke = false;
        const sideWidth = brick.geometry.parameters.width;
        const sideHeight = brick.geometry.parameters.height;

        const isTop =
          ball.position.y - ballRadius < brick.position.y + sideHeight / 2;
        const isBottom =
          ball.position.y + ballRadius > brick.position.y - sideHeight / 2;
        const isLeft =
          ball.position.x + ballRadius > brick.position.x - sideWidth / 2;
        const isRight =
          ball.position.x - ballRadius < brick.position.x + sideWidth / 2;

        const down =
          Math.abs(
            ball.position.y + ballRadius - (brick.position.y - sideHeight / 2)
          ) <
          Math.abs(
            ball.position.y + ballRadius - (brick.position.y + sideHeight / 2)
          );

        const top =
          Math.abs(
            ball.position.y - ballRadius - (brick.position.y + sideHeight / 2)
          ) <
          Math.abs(
            ball.position.y - ballRadius - (brick.position.y - sideHeight / 2)
          );

        const left =
          Math.abs(
            ball.position.x + ballRadius - (brick.position.x - sideWidth / 2)
          ) <
          Math.abs(
            ball.position.x + ballRadius - (brick.position.x + sideWidth / 2)
          );

        const right =
          Math.abs(
            ball.position.x - ballRadius - (brick.position.x + sideWidth / 2)
          ) <
          Math.abs(
            ball.position.x - ballRadius - (brick.position.x - sideWidth / 2)
          );

        const topHit =
          isLeft &&
          isRight &&
          top &&
          ball.position.y > brick.position.y + sideHeight / 2;

        const bottomHit =
          isLeft &&
          isRight &&
          down &&
          ball.position.y < brick.position.y - sideHeight / 2;

        const leftHit =
          isTop &&
          isBottom &&
          left &&
          ball.position.x < brick.position.x - sideWidth / 2;

        const rightHit =
          isTop &&
          isBottom &&
          right &&
          ball.position.x > brick.position.x + sideWidth / 2;

        if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          topHit
        ) {
          calculateReflection("up");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          bottomHit
        ) {
          calculateReflection("down");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          leftHit
        ) {
          calculateReflection("left");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          rightHit
        ) {
          calculateReflection("right");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken"
        ) {
          calculateReflection("edge");
          mustBroke = true;
        }

        if (mustBroke && !brick.indestructible) {
          hadColission = true;
          if (brick.specialType) {
            if (brick.name == "hitted") {
              baseScenario.remove(brick);
              brick.name = "broken";
            } else {
              brick.name = "hitted";
              brick.material = lambertNewGreyMaterial;
            }
          } else {
            baseScenario.remove(brick);
            brick.name = "broken";
          }

          if (powerUpAvailable && brick.name == "broken") {
            brickCounter++;

            if (brickCounter == 10) {
              powerUpAvailable = false;
              brickCounter = 0;

              powerUp = generatePowerUp(brick, brickWidth, baseScenario).powerUpBackground;
              powerUpPosition = powerUp.position;
            }
          }
        }
      });
    });
  };

  if (!hadColission && ball != null && ballVelocity != null) {
    detectColision();
  }

  return { ballVelocity, powerUpAvailable, brickCounter, hadColission, powerUp, powerUpPosition };
};

export const aditionalBrickColisionHandler = (
  ball,
  bricksMatrix,
  ballVelocity,
  baseScenario,
  powerUpAvailable,
  brickCounter,
  hadColission,
  brickWidth,
  powerUp,
  powerUpPosition
) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const calculateReflection = (side) => {
    let normal;

    if (side != "edge") {
      switch (side) {
        case "up":
          normal = new THREE.Vector3(0, 1, 0);
          break;
        case "down":
          normal = new THREE.Vector3(0, -1, 0);
          break;
        case "left":
          normal = new THREE.Vector3(1, 0, 0);
          break;
        case "right":
          normal = new THREE.Vector3(-1, 0, 0);
          break;
      }

      ballVelocity.reflect(normal);

      if (side == "down") {
        if (ballVelocity.y > 0) {
          ballVelocity.y = -ballVelocity.y
        }
      }
    } else {
      ballVelocity = new THREE.Vector3(
        ballVelocity.x,
        ballVelocity.y * -1,
        ballVelocity.z
      );
    }
  };

  const detectColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    bricksMatrix.forEach((brickRow) => {
      brickRow.forEach((brick) => {
        let brickBox = new THREE.Box3().setFromObject(brick);

        let mustBroke = false;
        const sideWidth = brick.geometry.parameters.width;
        const sideHeight = brick.geometry.parameters.height;

        const isTop =
          ball.position.y - ballRadius < brick.position.y + sideHeight / 2;
        const isBottom =
          ball.position.y + ballRadius > brick.position.y - sideHeight / 2;
        const isLeft =
          ball.position.x + ballRadius > brick.position.x - sideWidth / 2;
        const isRight =
          ball.position.x - ballRadius < brick.position.x + sideWidth / 2;

        const down =
          Math.abs(
            ball.position.y + ballRadius - (brick.position.y - sideHeight / 2)
          ) <
          Math.abs(
            ball.position.y + ballRadius - (brick.position.y + sideHeight / 2)
          );

        const top =
          Math.abs(
            ball.position.y - ballRadius - (brick.position.y + sideHeight / 2)
          ) <
          Math.abs(
            ball.position.y - ballRadius - (brick.position.y - sideHeight / 2)
          );

        const left =
          Math.abs(
            ball.position.x + ballRadius - (brick.position.x - sideWidth / 2)
          ) <
          Math.abs(
            ball.position.x + ballRadius - (brick.position.x + sideWidth / 2)
          );

        const right =
          Math.abs(
            ball.position.x - ballRadius - (brick.position.x + sideWidth / 2)
          ) <
          Math.abs(
            ball.position.x - ballRadius - (brick.position.x - sideWidth / 2)
          );

        const topHit =
          isLeft &&
          isRight &&
          top &&
          ball.position.y > brick.position.y + sideHeight / 2;

        const bottomHit =
          isLeft &&
          isRight &&
          down &&
          ball.position.y < brick.position.y - sideHeight / 2;

        const leftHit =
          isTop &&
          isBottom &&
          left &&
          ball.position.x < brick.position.x - sideWidth / 2;

        const rightHit =
          isTop &&
          isBottom &&
          right &&
          ball.position.x > brick.position.x + sideWidth / 2;

        if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          topHit
        ) {
          calculateReflection("up");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          bottomHit
        ) {
          calculateReflection("down");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          leftHit
        ) {
          calculateReflection("left");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken" &&
          rightHit
        ) {
          calculateReflection("right");
          mustBroke = true;
        } else if (
          brickBox.intersectsSphere(sphere) &&
          brick.name != "broken"
        ) {
          calculateReflection("edge");
          mustBroke = true;
        }

        if (mustBroke) {
          if (brick.specialType) {
            if (brick.name == "hitted") {
              baseScenario.remove(brick);
              brick.name = "broken";
            } else {
              brick.name = "hitted";
              brick.material = lambertNewGreyMaterial;
            }
          } else {
            baseScenario.remove(brick);
            brick.name = "broken";
          }

          if (powerUpAvailable && brick.name == "broken") {
            brickCounter++;

            if (brickCounter == 10) {
              powerUpAvailable = false;
              brickCounter = 0;

              powerUp = generatePowerUp(brick, brickWidth, baseScenario).powerUpBackground;
              powerUpPosition = powerUp.position;
            }
          }
        }
      });
    });
  };

  if (!hadColission && ball != null && ballVelocity != null) {
    detectColision();
  }

  const aditionalBallVelocity = ballVelocity;

  return { aditionalBallVelocity, powerUpAvailable, brickCounter, hadColission, powerUp, powerUpPosition };
};

export const hitterColisionHandler = (ball, ballVelocity, hitter, colissionDetected) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const hitterSize = 0.225 * 14;

  const hitterGeometry = new THREE.BoxGeometry(hitterSize, 0.25, 1);
  const lambertPinkMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });

  const hitterCenter = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterLeftBorder = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterRightBorder = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterLeftCorner = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterRightCorner = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);

  hitterCenter.position.copy(hitter.position);
  hitterCenter.position.y = hitter.position.y + 0.6;

  hitterLeftBorder.position.copy(hitter.position);
  hitterLeftBorder.position.y = hitter.position.y + 0.4;
  hitterLeftBorder.position.x = hitter.position.x - 0.6;

  hitterRightBorder.position.copy(hitter.position);
  hitterRightBorder.position.y = hitter.position.y + 0.4;
  hitterRightBorder.position.x = hitter.position.x + 0.6;

  hitterLeftCorner.position.copy(hitter.position);
  hitterLeftCorner.position.y = hitter.position.y + 0.5;
  hitterLeftCorner.position.x = hitter.position.x - 0.3;

  hitterRightCorner.position.copy(hitter.position);
  hitterRightCorner.position.y = hitter.position.y + 0.5;
  hitterRightCorner.position.x = hitter.position.x + 0.3;

  const calculateNormal = () => {
    let angle, angleAnalysis;

    if (hitter.position.x > ball.position.x) {
      const point = ball.position.x - hitter.position.x;

      angle = (-240 + (((point + 1.575) * (90 + 240)) / 1.575));
      
      angleAnalysis = "left";
    } 

    if (hitter.position.x <= ball.position.x) {
      const point = ball.position.x - hitter.position.x;

      angle = (90 + ((point * -30) / 1.575));

      angleAnalysis = "right";
    }

    let normalX = -Math.sin(angle);
    let normalY = Math.cos(angle);

    if (normalY < 0) {
      normalX = normalX * -1;
      normalY = normalY * -1;
    }

    return { normalX, normalY, angleAnalysis };
  }

  const calculateHitterReflection = (normal, angleAnalysis) => {
    const incidentVector = ballVelocity;

    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));

    if (reflectionVector.y < 0) {
      reflectionVector.y = reflectionVector.y * -1;
    }

    if (angleAnalysis == "right") {
      if (reflectionVector.x < 0) {
        reflectionVector.x = reflectionVector.x * -1;
      }
    }
    
    if (angleAnalysis == "left") {
      if (reflectionVector.x > 0) {
        reflectionVector.x = reflectionVector.x * -1;
      }
    }

    ballVelocity = reflectionVector;
  };

  const detectHitterColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    const hitterCenterBox = new THREE.Box3().setFromObject(hitterCenter);
    const hitterLeftBorderBox = new THREE.Box3().setFromObject(hitterLeftBorder);
    const hitterRightBorderBox = new THREE.Box3().setFromObject(hitterRightBorder);
    const hitterLeftCornerBox = new THREE.Box3().setFromObject(hitterLeftCorner);
    const hitterRightCornerBox = new THREE.Box3().setFromObject(hitterLeftBorder);

    if (
      hitterCenterBox.intersectsSphere(sphere) ||
      hitterLeftBorderBox.intersectsSphere(sphere) ||
      hitterRightBorderBox.intersectsSphere(sphere) ||
      hitterLeftCornerBox.intersectsSphere(sphere) ||
      hitterRightCornerBox.intersectsSphere(sphere)
    ) {
      const {normalX, normalY, angleAnalysis} = calculateNormal();
      const normal = new THREE.Vector3(normalX, normalY, 0);
      calculateHitterReflection(normal, angleAnalysis);
    }
  };

  if (ball != null && ballVelocity != null) {
    detectHitterColision();
  }

  return { ballVelocity, colissionDetected };
};

export const aditionalHitterColisionHandler = (ball, ballVelocity, hitter, colissionDetected) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }

  const hitterSize = 0.225 * 14;

  const hitterGeometry = new THREE.BoxGeometry(hitterSize, 0.25, 1);
  const lambertPinkMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });

  const hitterCenter = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterLeftBorder = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterRightBorder = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterLeftCorner = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);
  const hitterRightCorner = new THREE.Mesh(hitterGeometry, lambertPinkMaterial);

  hitterCenter.position.copy(hitter.position);
  hitterCenter.position.y = hitter.position.y + 0.6;

  hitterLeftBorder.position.copy(hitter.position);
  hitterLeftBorder.position.y = hitter.position.y + 0.4;
  hitterLeftBorder.position.x = hitter.position.x - 0.6;

  hitterRightBorder.position.copy(hitter.position);
  hitterRightBorder.position.y = hitter.position.y + 0.4;
  hitterRightBorder.position.x = hitter.position.x + 0.6;

  hitterLeftCorner.position.copy(hitter.position);
  hitterLeftCorner.position.y = hitter.position.y + 0.5;
  hitterLeftCorner.position.x = hitter.position.x - 0.3;

  hitterRightCorner.position.copy(hitter.position);
  hitterRightCorner.position.y = hitter.position.y + 0.5;
  hitterRightCorner.position.x = hitter.position.x + 0.3;

  const calculateNormal = () => {
    let angle, angleAnalysis;

    if (hitter.position.x > ball.position.x) {
      const point = ball.position.x - hitter.position.x;

      angle = (-240 + (((point + 1.575) * (90 + 240)) / 1.575));
      
      angleAnalysis = "left";
    } 

    if (hitter.position.x <= ball.position.x) {
      const point = ball.position.x - hitter.position.x;

      angle = (90 + ((point * -30) / 1.575));

      angleAnalysis = "right";
    }

    let normalX = -Math.sin(angle);
    let normalY = Math.cos(angle);

    if (normalY < 0) {
      normalX = normalX * -1;
      normalY = normalY * -1;
    }

    return { normalX, normalY, angleAnalysis };
  }

  const calculateHitterReflection = (normal, angleAnalysis) => {
    const incidentVector = ballVelocity;

    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));

    if (reflectionVector.y < 0) {
      reflectionVector.y = reflectionVector.y * -1;
    }

    if (angleAnalysis == "right") {
      if (reflectionVector.x < 0) {
        reflectionVector.x = reflectionVector.x * -1;
      }
    }
    
    if (angleAnalysis == "left") {
      if (reflectionVector.x > 0) {
        reflectionVector.x = reflectionVector.x * -1;
      }
    }

    ballVelocity = reflectionVector;
  };

  const detectHitterColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    const hitterCenterBox = new THREE.Box3().setFromObject(hitterCenter);
    const hitterLeftBorderBox = new THREE.Box3().setFromObject(hitterLeftBorder);
    const hitterRightBorderBox = new THREE.Box3().setFromObject(hitterRightBorder);
    const hitterLeftCornerBox = new THREE.Box3().setFromObject(hitterLeftCorner);
    const hitterRightCornerBox = new THREE.Box3().setFromObject(hitterLeftBorder);

    if (
      hitterCenterBox.intersectsSphere(sphere) ||
      hitterLeftBorderBox.intersectsSphere(sphere) ||
      hitterRightBorderBox.intersectsSphere(sphere) ||
      hitterLeftCornerBox.intersectsSphere(sphere) ||
      hitterRightCornerBox.intersectsSphere(sphere)
    ) {
      const {normalX, normalY, angleAnalysis} = calculateNormal();
      const normal = new THREE.Vector3(normalX, normalY, 0);
      calculateHitterReflection(normal, angleAnalysis);
    }
  };

  if (ball != null && ballVelocity != null) {
    detectHitterColision();
  }

  const aditionalBallVelocity = ballVelocity
  return { aditionalBallVelocity, colissionDetected };
};