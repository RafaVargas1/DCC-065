import * as THREE from "three";

export const wallColisionHandler = (ball, wallsMeshArray) => {

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        wallsMeshArray.forEach(wall => {
            const box = new THREE.Box3().setFromObject(wall);

            if (box.intersectsSphere(sphere)) {

            }
        })
    }

    detectColision();

    return {}
}

export const brickColisionHandler = (ball, bricksMatrix, baseScenario) => {

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x);

        bricksMatrix.forEach(brickRow => {
            brickRow.forEach(brick => {
                const box = new THREE.Box3().setFromObject(brick);

                if (box.intersectsSphere(sphere)) {
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

    return {}
}