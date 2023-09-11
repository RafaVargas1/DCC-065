import * as THREE from "three";

export const wallColisionHandler = (ball, wallsMeshArray, ballVelocity) => {

    const calculateReflection = (wallIndex) => {
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

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        wallsMeshArray.forEach((wall, wallIndex) => {
            const boxCollided = new THREE.Box3().setFromObject(wall);

            if (boxCollided.intersectsSphere(sphere)) {
                calculateReflection(wallIndex);
            }
        })
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

                const boxVerticalLeft = new THREE.Box3().setFromPoints(vLeft);
                const boxVerticalRight = new THREE.Box3().setFromPoints(vRight);
                const boxHorizontalUp = new THREE.Box3().setFromPoints(hUp);
                const boxHorizontalDown = new THREE.Box3().setFromPoints(hDown);

                if (boxHorizontalUp.intersectsSphere(sphere) || boxHorizontalDown.intersectsSphere(sphere) || boxVerticalLeft.intersectsSphere(sphere) || boxVerticalRight.intersectsSphere(sphere)) {
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

export const hitterColisionHandler = () => {

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        wallsMeshArray.forEach((wall, wallIndex) => {
            const boxCollided = new THREE.Box3().setFromObject(wall);

            if (boxCollided.intersectsSphere(sphere)) {
                calculateReflection(wallIndex);
            }
        })
    }

    detectColision();
}