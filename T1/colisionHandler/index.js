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
  const hitterCenterRadius = (0.125 * 14) / 2;
  const hitterBorderRadius = (0.100 * 14) / 2;

  const rightBorder = new THREE.Vector3(hitter.position.x + 0.7, hitter.position.y + 0.1, hitter.position.z);
  const leftBorder = new THREE.Vector3(hitter.position.x - 0.7, hitter.position.y + 0.1, hitter.position.z);

  const calculateHitterReflection = (hitterSphere, ballSphere, position) => {
    const collisionPoint = checkCollision(hitterSphere, ballSphere, position);

    const normal = new THREE.Vector3().copy(collisionPoint).normalize();

    const incidentVector = ballVelocity;

    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));

    ballVelocity.x = reflectionVector.x;
    ballVelocity.y = reflectionVector.y;
    ballVelocity.z = incidentVector.z;
  };

  const checkCollision = (hitterSphere, ballSphere, position) => {
    const distance = hitterSphere.center.distanceTo(ballSphere.center);

    let hitterRadius;

    if (position == "center") {
      hitterRadius = (0.125 * 14) / 2;
    } else if (position == "border") {
      hitterRadius = (0.100 * 14) / 2;
    }

    if (distance < hitterRadius + ballRadius) {
      const direction = new THREE.Vector3().subVectors(ballSphere.center, hitterSphere.center).normalize();
      const collisionPoint = new THREE.Vector3().copy(hitterSphere.center).addScaledVector(direction, hitterRadius);

      return collisionPoint;
    }
  };

  const detectHitterColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);

    const hitterCenter = new THREE.Sphere(hitter.position, hitterCenterRadius);
    const hitterBorderRight = new THREE.Sphere(rightBorder, hitterBorderRadius);
    const hitterBorderLeft = new THREE.Sphere(leftBorder, hitterBorderRadius);

    if ((hitterCenter.intersectsSphere(sphere) || hitterBorderRight.intersectsSphere(sphere) || hitterBorderLeft.intersectsSphere(sphere)) && !colissionDetected) {
      if (hitterCenter.intersectsSphere(sphere) && !colissionDetected) {
        colissionDetected = true;
        calculateHitterReflection(hitterCenter, sphere, "center");
      } else if (hitterBorderRight.intersectsSphere(sphere) && !colissionDetected) {
        colissionDetected = true;
        calculateHitterReflection(hitterBorderRight, sphere, "border");
      } else if (hitterBorderLeft.intersectsSphere(sphere) && !colissionDetected) {
        colissionDetected = true;
        calculateHitterReflection(hitterBorderLeft, sphere, "border");
      }
    }
  };

  if (ball != null && ballVelocity != null) {
    detectHitterColision();
  }

  return { ballVelocity, colissionDetected };
};

export const aditionalHitterColisionHandler = (ball, ballVelocity, hitter) => {
  let ballRadius;

  if (ball != null) {
    ballRadius = ball.geometry.parameters.radius;
  }
  const hitterRadius = (0.225 * 14) / 2;

  const calculateHitterReflection = (hitterSphere, ballSphere) => {
    const collisionPoint = checkCollision(hitterSphere, ballSphere);

    const normal = new THREE.Vector3().copy(collisionPoint).normalize();

    const incidentVector = ballVelocity;

    const reflectionVector = incidentVector
      .clone()
      .sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));

    ballVelocity.x = reflectionVector.x;
    ballVelocity.y = reflectionVector.y;
    ballVelocity.z = incidentVector.z;
  };

  const checkCollision = (hitterSphere, ballSphere) => {
    const distance = hitterSphere.center.distanceTo(ballSphere.center);

    if (distance < hitterRadius + ballRadius) {
      const direction = new THREE.Vector3().subVectors(ballSphere.center, hitterSphere.center).normalize();
      const collisionPoint = new THREE.Vector3().copy(hitterSphere.center).addScaledVector(direction, hitterRadius);

      return collisionPoint;
    }
  };

  const detectHitterColision = () => {
    const sphere = new THREE.Sphere(ball.position, ballRadius);
    const hitterBox = new THREE.Sphere(hitter.position, hitterRadius);

    if (hitterBox.intersectsSphere(sphere)) {
      calculateHitterReflection(hitterBox, sphere);
    }
  };

  if (ball != null && ballVelocity != null) {
    detectHitterColision();
  }

  const aditionalBallVelocity = ballVelocity
  return { aditionalBallVelocity };
};