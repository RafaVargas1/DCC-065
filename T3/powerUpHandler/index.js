import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export const generatePowerUp = (brick, brickWidth, baseScenario, powerUpType) => {
    const brickHeight = 0.8;

    const path = "./assets/textures/" + powerUpType + ".png";

    const texture = textureLoader.load(path);

    const powerUpGeometry = new THREE.CapsuleGeometry(brickHeight / 2, brickWidth / 2);
    const powerUpMaterial = new THREE.MeshLambertMaterial();
    powerUpMaterial.map = texture;

    const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);

    powerUp.position.copy(brick.position);

    powerUp.rotateZ(Math.PI / 2);

    powerUp.castShadow = true;

    powerUp.powerUpType = powerUpType;

    baseScenario.add(powerUp);

    return powerUp;
}

export const removePowerUp = (powerUp, powerUpPosition, baseScenario, gameWidth, powerUpAvailable) => {
    if (powerUp != null && powerUpPosition != null && !powerUpAvailable && powerUp.name != "picked") {
        if (powerUpPosition.y < (2.5 * gameWidth) / -2) {
            baseScenario.remove(powerUp);

            powerUpAvailable = true;
            powerUp = null;
            powerUpPosition = null;
        }
    }

    return { powerUpAvailable, powerUp, powerUpPosition };
}

export const pickUpPowerUp = (powerUp, powerUpPosition, hitter, baseScenario, ballPosition, ballVelocity, aditionalBall, aditionalBallPosition, aditionalBallVelocity, ball) => {
    if (powerUpPosition != null && powerUp != null) {
        const hitterPosition = hitter.position;

        const rightX = powerUpPosition.x + 0.3 >= hitterPosition.x - ((0.225 * 14) / 2) && powerUpPosition.x - 0.3 <= hitterPosition.x + ((0.225 * 14) / 2);
        const rightY = powerUpPosition.y + 0.2 <= hitterPosition.y + ((0.225 * 14) / 2) && powerUpPosition.y + 0.2 >= (hitterPosition.y + ((0.225 * 14) / 2)) - 0.4;

        if (rightX && rightY && powerUp.name != "picked") {
            baseScenario.remove(powerUp);
            powerUp.name = "picked";

            switch (powerUp.powerUpType) {
                case "aditionalBall":
                    aditionalBall = activateAditionalBall(ballPosition, baseScenario);
                    aditionalBallPosition = [aditionalBall[0].position, aditionalBall[1].position];
                    aditionalBallVelocity = [new THREE.Vector3(ballVelocity.x - 0.5, ballVelocity.y, ballVelocity.z), new THREE.Vector3(ballVelocity.x + 0.5, ballVelocity.y, ballVelocity.z)];
                    break;
                case "ignoreColision":
                    const phongRedMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: "200", specular: "rgb(255, 255, 255)" });
                    ball.material = phongRedMaterial;
                    ball.ignoreColision = true;
                    break;
            }

            powerUp = null;
            powerUpPosition = null;
        }
    }

    return { aditionalBall, aditionalBallPosition, aditionalBallVelocity, powerUp, powerUpPosition, ball };
}

const activateAditionalBall = (ballPosition, baseScenario) => {
    const ballGeometry = new THREE.SphereGeometry(0.2);
    const phongYellowMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: "200", specular: "rgb(255, 255, 255)" });

    let aditionalBall = [];

    for (let i = 0; i < 2; i++) {
        aditionalBall[i] = new THREE.Mesh(ballGeometry, phongYellowMaterial);

        aditionalBall[i].position.copy(ballPosition);

        aditionalBall[i].castShadow = true;

        baseScenario.add(aditionalBall[i]);
    }

    return aditionalBall;
}

export const checkPowerUp = (aditionalBall, powerUp, ball) => {
    let powerUpAvailable;

    if (aditionalBall != null || powerUp != null || ball.ignoreColision) {
        powerUpAvailable = false;
    } else {
        powerUpAvailable = true;
    }

    return { powerUpAvailable };
}

export const powerUpMovement = (powerUp, powerUpPosition, gameRunning) => {
    if (gameRunning && powerUp != null && powerUpPosition != null) {
        powerUpPosition.add(new THREE.Vector3(0, -0.1, 0));
        powerUp.position.copy(powerUpPosition);

        powerUp.rotateY(Math.PI / 18);
    }

    return { powerUpPosition };
}