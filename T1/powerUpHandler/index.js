import * as THREE from "three";

export const generatePowerUp = (brick, brickWidth, baseScenario) => {
    const brickHeight = 0.8;

    const powerUpBackgroundGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, 1);
    const powerUpSymbolGeometry = new THREE.SphereGeometry(0.2);

    const lambertYellowMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const lambertRedMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

    const powerUpBackground = new THREE.Mesh(powerUpBackgroundGeometry, lambertRedMaterial);
    const powerUpSymbol = new THREE.Mesh(powerUpSymbolGeometry, lambertYellowMaterial);

    powerUpBackground.position.copy(brick.position);

    powerUpBackground.castShadow = true;

    powerUpBackground.add(powerUpSymbol);

    powerUpSymbol.position.copy(new THREE.Vector3(0, 0, 0.5));

    baseScenario.add(powerUpBackground);

    return { powerUpBackground };
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

export const pickUpPowerUp = (powerUp, powerUpPosition, hitter, baseScenario, ballPosition, ballVelocity, aditionalBall, aditionalBallPosition, aditionalBallVelocity) => {
    if (powerUpPosition != null && powerUp != null) {
        const hitterPosition = hitter.position;

        const rightX = powerUpPosition.x + 0.6 >= hitterPosition.x - ((0.225 * 14) / 2) && powerUpPosition.x - 0.6 <= hitterPosition.x + ((0.225 * 14) / 2);
        const rightY = powerUpPosition.y - 0.4 <= hitterPosition.y + ((0.225 * 14) / 2) && powerUpPosition.y + 0.4 >= (hitterPosition.y + ((0.225 * 14) / 2)) - 0.4;

        if (rightX && rightY && powerUp.name != "picked") {
            baseScenario.remove(powerUp);
            powerUp.name = "picked";
            aditionalBall = activatePowerUp(ballPosition, baseScenario);
            aditionalBallPosition = new THREE.Vector3(ballPosition.x >= 0 ? ballPosition.x - 1.5 : ballPosition.x + 1.5, ballPosition.y, ballPosition.z);
            aditionalBallVelocity = ballVelocity.reflect(new THREE.Vector3(1, 0, 0));

            powerUp = null;
            powerUpPosition = null;
        }
    }

    return { aditionalBall, aditionalBallPosition, aditionalBallVelocity, powerUp, powerUpPosition };
}

const activatePowerUp = (ballPosition, baseScenario) => {
    const ballGeometry = new THREE.SphereGeometry(0.2);
    const phongYellowMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

    const aditionalBall = new THREE.Mesh(ballGeometry, phongYellowMaterial);

    aditionalBall.position.copy(ballPosition);

    aditionalBall.castShadow = true;

    baseScenario.add(aditionalBall);

    return aditionalBall;
}

export const checkPowerUp = (aditionalBall, powerUp) => {
    let powerUpAvailable;

    if (aditionalBall != null || powerUp != null) {
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
    }

    return { powerUpPosition };
}