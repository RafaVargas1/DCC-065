import * as THREE from "three";

function changeDirection(vector, inclination, azimuth) {
    const radius = vector.length(); // Obtém o comprimento do vetor

    // Converte coordenadas esféricas para cartesianas
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.sin(inclination) * Math.sin(azimuth);

    // Retorna o novo vetor com a mesma magnitude (comprimento)
    return new THREE.Vector3(x, y, 0);
}

export const wallColisionHandler = (ball, wallsMeshArray, ballVelocity) => {

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
    }

    const detectWallColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        wallsMeshArray.forEach((wall, wallIndex) => {
            const boxCollided = new THREE.Box3().setFromObject(wall);

            if (boxCollided.intersectsSphere(sphere)) {
                calculateWallReflection(wallIndex);
            }
        })
    }

    detectWallColision();

    return { ballVelocity }
}

export const floorColisionHandler = (ball, ballVelocity, gameWidth) => {

    const detectColision = () => {
        if (ball.position.y < 1.8 * gameWidth / -2) {
            ball.position.copy(new THREE.Vector3(0.0, 1.4 * gameWidth / -2, 0.0));
            ballVelocity = new THREE.Vector3(0.0, 0.3, 0.0);
        }
    }

    detectColision();

    return { ballVelocity }
}

export const brickColisionHandler = (ball, bricksMatrix, ballVelocity, baseScenario) => {

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

        const incidentVector = ballVelocity;
        const reflectionVector = incidentVector.clone().sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));
        ballVelocity = reflectionVector;
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


                if ((boxHorizontalUp.intersectsSphere(sphere) || boxHorizontalDown.intersectsSphere(sphere) || boxVerticalLeft.intersectsSphere(sphere) || boxVerticalRight.intersectsSphere(sphere)) && brick.name != "broken") {

                    
                    if (boxHorizontalUp.intersectsSphere(sphere)) {
                        calculateReflection("up");
                    }

                    if (boxHorizontalDown.intersectsSphere(sphere)) {
                        calculateReflection("down");
                    }

                    if (boxVerticalLeft.intersectsSphere(sphere)) {
                        calculateReflection("left");
                    }

                    if (boxVerticalRight.intersectsSphere(sphere)) {
                        calculateReflection("right");
                    }


                    if (brick.name == "hitted") {
                        baseScenario.remove(brick);

                        brick.name = "broken";
                    } else {
                        brick.name = "hitted";
                    }
                }
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

        for (let i=0; i < hitter.children.length; i++){
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

