import * as THREE from "three";

function changeDirection(vector, inclination, azimuth) {
  const radius = vector.length(); // Obtém o comprimento do vetor

  // Converte coordenadas esféricas para cartesianas
  const x = radius * Math.sin(inclination) * Math.cos(azimuth);
  const y = radius * Math.sin(inclination) * Math.sin(azimuth);

  // Retorna o novo vetor com a mesma magnitude (comprimento)
  return new THREE.Vector3(x, y, 0);
}

export const wallColisionHandler = (
  ball,
  wallsMeshArray,
  ballVelocity,
  wallColision
) => {
  const ballRadius = ball.geometry.parameters.radius;

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

    wallColision = true;
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

  detectWallColision();

  return { ballVelocity, wallColision };
};

export const floorColisionHandler = (
  ball,
  ballVelocity,
  gameWidth,
  gameRunning,
  hitter,
  gameStart
) => {
  const detectColision = () => {
    if (ball.position.y < (1.8 * gameWidth) / -2) {
      ball.position.copy(new THREE.Vector3(0.0, (1.4 * gameWidth) / -2, 0.0));
      ballVelocity = new THREE.Vector3(0.0, 0.0, 0.0);
      gameRunning = false;
      gameStart = false;
      hitter.position.copy(new THREE.Vector3(0.0, (1.5 * 14) / -2, 1), 1);
    }
  };

  detectColision();

  return { ballVelocity, gameRunning, gameStart };
};

export const brickColisionHandler = (
  ball,
  bricksMatrix,
  ballVelocity,
  baseScenario
) => {
  const ballRadius = ball.geometry.parameters.radius;

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
          baseScenario.remove(brick);
          brick.name = "broken";
        }
        
      });
    });
  };

  detectColision();

  return { ballVelocity };
};

export const hitterColisionHandler = (ball, ballVelocity, hitter) => {
  const ballRadius = ball.geometry.parameters.radius;
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

  detectHitterColision();

  return { ballVelocity };
};
