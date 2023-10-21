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

export const brickColisionHandler = (ball, bricksMatrix, ballVelocity, baseScenario, fase) => {
    const ballRadius = ball.geometry.parameters.radius;

    const calculateReflection = (side) => {
        let normal;
        // ballVelocity =  new THREE.Vector3(0, 0, 0);
        const oldY = ballVelocity.y;

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

     
        if (oldY > 0 && ballVelocity.y > 0) {
            ballVelocity.y = (ballVelocity.y) * -1;
        }
        
    }

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        // const totalBricks = 
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

                // const upHit = ball.position.y > brickY;
                // const downHit = ball.position.y < brickY;
                // const leftHit = ball.position.x < brickX;
                // const rightHit = ball.position.x > brickX;

                const topHit = (ball.position.y - ballRadius) < (brick.position.y + sideHeight / 2);
                const bottomHit = (ball.position.y + ballRadius) > (brick.position.y - sideHeight / 2);
                const leftHit = (ball.position.x + ballRadius) > (brick.position.x - sideWidth / 2);
                const rightHit = (ball.position.x - ballRadius) < (brick.position.x + sideWidth / 2);


                if (boxHorizontalUp.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = leftHit && rightHit;

                    if (topHit && brickHit) {
                        calculateReflection("up");
                        mustBroke = true;
                    }
                }  

                if (boxHorizontalDown.intersectsSphere(sphere) && brick.name != "broken") {
                    // const brickHit = isLeft && isRight;
                    const brickHit = leftHit && rightHit;

                    if (bottomHit && brickHit) {
                        calculateReflection("down");
                        mustBroke = true;
                    }
                } 
                
                if (boxVerticalLeft.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = topHit && bottomHit;

                    if (leftHit && brickHit) {
                        calculateReflection("left");
                        mustBroke = true;
                    }
                }  

                if (boxVerticalRight.intersectsSphere(sphere) && brick.name != "broken") {
                    const brickHit = topHit && bottomHit;

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

    return { ballVelocity, fase }
}

export const hitterColisionHandler = (ball, ballVelocity, hitter) => {

    const inclineVector = ( vector, angle ) => {
        const module = vector.length();

        const newX = module * Math.cos(angle);
        const newY =  module * Math.sin(angle);
      

        const newVector = new THREE.Vector3(newX, newY, 0);

        return newVector;

    }

    const calculateHitterReflection = (hitterIndex) => {
        let reflectionAngle;

        reflectionAngle = ((5 - hitterIndex) * Math.PI / 6);

        const reflectionDirection = inclineVector( new THREE.Vector3(0, 1, 0), reflectionAngle);
    
        ballVelocity = ballVelocity.reflect(reflectionDirection);

        ballVelocity.y = Math.abs(ballVelocity.y);
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

