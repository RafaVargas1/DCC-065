import * as THREE from "three";

function changeDirection(vector, inclination, azimuth) {
    const radius = vector.length(); // Obtém o comprimento do vetor

    // Converte coordenadas esféricas para cartesianas
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.sin(inclination) * Math.sin(azimuth);

    // Retorna o novo vetor com a mesma magnitude (comprimento)
    return new THREE.Vector3(x, y, 0);
}

export const wallColisionHandler = (ball, wallsMeshArray, ballVelocity, wallColision) => {

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
        const reflectionVector = incidentVector.clone().sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));
        ballVelocity = reflectionVector;

        wallColision = true;
    }

    const detectWallColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        wallsMeshArray.forEach((wall, wallIndex) => {
            const boxCollided = new THREE.Box3().setFromObject(wall);

            if (boxCollided.intersectsSphere(sphere)) {
                if (wallIndex === 0) {
                    const wallWidth = wall.geometry.parameters.width;

                    if (ball.position.x - ballRadius < wall.position.x + wallWidth / 2)
                        calculateWallReflection(wallIndex);
                } else if (wallIndex === 1) {
                    const wallWidth = wall.geometry.parameters.width;

                    if (ball.position.x + ballRadius > wall.position.x - wallWidth / 2)
                        calculateWallReflection(wallIndex);
                } else if (wallIndex == 2) {
                    const wallHeight = wall.geometry.parameters.height;

                    if (ball.position.y + ballRadius > wall.position.y - wallHeight / 2)
                        calculateWallReflection(wallIndex);
                }
            }
        })
    }

    if (!wallColision) {
        detectWallColision();
    }

    return { ballVelocity, wallColision }
}

export const floorColisionHandler = (ball, ballVelocity, gameWidth, gameRunning, hitter, gameStart) => {

    const detectColision = () => {
        if (ball.position.y < 1.8 * gameWidth / -2) {
            ball.position.copy(new THREE.Vector3(0.0, 1.4 * gameWidth / -2, 0.0));
            ballVelocity = new THREE.Vector3(0.0, 0.0, 0.0);
            gameRunning = false;
            gameStart = false;
            hitter.position.copy(new THREE.Vector3(0.0, 1.5 * 14 / -2, 1), 1);
        }
    }

    detectColision();

    return { ballVelocity, gameRunning, gameStart }
}

export const brickColisionHandler = (ball, bricksMatrix, ballVelocity, baseScenario) => {
    const ballRadius = ball.geometry.parameters.radius;

    const calculateReflection = (side) => {
        let normal;

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
    }

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        bricksMatrix.forEach(brickRow => {
            brickRow.forEach(brick => {
                const brickX = brick.position.x;
                const brickY = brick.position.y;
                
                const points = [
                    new THREE.Vector3(brickX - 0.5, brickY + 0.5, 0.0),
                    new THREE.Vector3(brickX + 0.5, brickY + 0.5, 0.0),
                    new THREE.Vector3(brickX - 0.5, brickY - 0.5, 0.0),
                    new THREE.Vector3(brickX + 0.5, brickY - 0.5, 0.0)
                ];

                const vLeft = [
                    points[0],
                    points[2]
                ];

                const vRight = [
                    points[1],
                    points[3]
                ];

                const hUp = [     
                    points[0],
                    points[1]               
                ];

                const hDown = [
                    points[2],
                    points[3]
                ];

                let boxVerticalLeft = new THREE.Box3().setFromPoints(vLeft);
                let boxVerticalRight = new THREE.Box3().setFromPoints(vRight);
                let boxHorizontalUp = new THREE.Box3().setFromPoints(hUp);
                let boxHorizontalDown = new THREE.Box3().setFromPoints(hDown);

                let mustBroke = false;
                const sideWidth = brick.geometry.parameters.width;
                const sideHeight = brick.geometry.parameters.height;

                const upHit = ball.position.y > brickY;
                const downHit = ball.position.y < brickY;
                const leftHit = ball.position.x < brickX;
                const rightHit = ball.position.x > brickX;

                const isUp = (ball.position.y - ballRadius) < (brick.position.y + sideHeight / 2);
                const isDown = (ball.position.y + ballRadius) > (brick.position.y - sideHeight / 2);
                const isLeft = (ball.position.x + ballRadius) > (brick.position.x - sideWidth / 2);
                const isRight = (ball.position.x - ballRadius) < (brick.position.x + sideWidth / 2);

                if (boxHorizontalUp.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = isLeft && isRight;

                    if (upHit && brickHit) {
                        calculateReflection("up");
                        mustBroke = true;
                    }
                }

                if (boxHorizontalDown.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = isLeft && isRight;

                    if (downHit && brickHit) {
                        calculateReflection("down");
                        mustBroke = true;
                    }
                }
                
                if (boxVerticalLeft.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = isUp && isDown;

                    if (leftHit && brickHit) {
                        calculateReflection("left");
                        mustBroke = true;
                    }
                }

                if (boxVerticalRight.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = isUp && isDown;

                    if (rightHit && brickHit) {
                        calculateReflection("right");
                        mustBroke = true;
                    }
                }

                if (mustBroke) {
                    baseScenario.remove(brick);
                    brick.name = "broken";
                }

               //if (brick.name == "hitted") {
               //    baseScenario.remove(brick);
               //    brick.name = "broken";
               //} else {
               //    brick.name = "hitted";
               //}

            })
        })
    }

    detectColision();

    return { ballVelocity }
}

export const hitterColisionHandler = (ball, ballVelocity, hitter) => {

    const calculateHitterReflection = (hitterIndex) => {
        let reflectionAngle;

        reflectionAngle = ((hitterIndex + 1) * -1) * Math.PI / 6;

        const reflectionDirection = new THREE.Vector3(Math.cos(reflectionAngle), Math.sin(reflectionAngle), 0);

        const velocity = ballVelocity;
        const dotProduct = velocity.dot(reflectionDirection);
        const reflectionVector = velocity.clone().sub(reflectionDirection.clone().multiplyScalar(2 * dotProduct));

        ballVelocity = reflectionVector;
        ballVelocity.y = Math.abs(reflectionVector.y)
    }


    const detectHitterColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        hitter.updateMatrixWorld()

        for (let i = 0; i < hitter.children.length; i++) {
            hitter.updateMatrixWorld();
            hitter.children[i].updateMatrixWorld();

            const boxCollided = new THREE.Box3().setFromObject(hitter.children[i]);

            if (boxCollided.intersectsSphere(sphere)) {
                calculateHitterReflection(i);
                break;
            }
        }

    }

    detectHitterColision();

    return { ballVelocity }
}
