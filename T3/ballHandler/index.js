import * as THREE from "three";

export const ballMovementHandler = (ball, ballPosition, ballVelocity, time, elapsedTime, multiplyFactor, startVelocity, timesIncreased, gameRunning, gameStart, hitter, gameFinish) => {

    const initialPositioning = () => {
        ball.position.copy(new THREE.Vector3(hitter.position.x, ballPosition.y, 0.6));
    }

    const calculateResultantVector = (vector) => {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    const defaultMovement = () => {
        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }
    }

    const accelerateMovement = () => {
        const timesInASecond = 4;

        if (!gameRunning) {
            return;
        }

        const integerPart = Math.trunc(elapsedTime + 1 / 75);
        const decimalPart = elapsedTime - integerPart;

        if (elapsedTime + 1 / 75 > Math.ceil(elapsedTime)) {
            timesIncreased = 0;
        }

        if (
            ((decimalPart) > (1 / (timesInASecond + 1) * timesIncreased)) &&
            (elapsedTime <= time) &&
            (calculateResultantVector(ballVelocity) < (2 * startVelocity))
        ) {
            ballVelocity.multiplyScalar(multiplyFactor)

            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);

            timesIncreased++;
        } else {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }

        elapsedTime += 1 / 75;
    }

    if (!gameStart && !gameFinish) {
        initialPositioning();
    } else {
        if (elapsedTime < time) {
            accelerateMovement();
        } else {
            defaultMovement();
        }
    }

    return { ballPosition, elapsedTime, ballVelocity, timesIncreased }
}

export const aditionalBallMovementHandler = (aditionalBall, aditionalBallPosition, aditionalBallVelocity, gameRunning, time, elapsedTime, multiplyFactor, startVelocity, timesIncreased) => {
    const calculateResultantVector = (vector) => {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    const accelerateMovement = () => {
        const timesInASecond = 4;

        if (!gameRunning) {
            return;
        }

        const integerPart = Math.trunc(elapsedTime + 1 / 75);
        const decimalPart = elapsedTime - integerPart;

        if (elapsedTime + 1 / 75 > Math.ceil(elapsedTime)) {
            timesIncreased = 0;
        }

        if (
            ((decimalPart) > (1 / (timesInASecond + 1) * timesIncreased)) &&
            (elapsedTime <= time) &&
            (calculateResultantVector(aditionalBallVelocity) < (2 * startVelocity))
        ) {
            for (let i = 0; i < aditionalBall.length; i++) {
                if (aditionalBall[i] != null && aditionalBallPosition[i] != null && aditionalBallVelocity[i] != null) {
                    aditionalBallVelocity[i].multiplyScalar(multiplyFactor)

                    aditionalBallPosition[i].add(aditionalBallVelocity[i]);
                    aditionalBall[i].position.copy(aditionalBallPosition[i]);

                    timesIncreased++;
                }
            }
        } else {
            for (let i = 0; i < aditionalBall.length; i++) {
                if (aditionalBall[i] != null && aditionalBallPosition[i] != null && aditionalBallVelocity[i] != null) {
                    aditionalBallPosition[i].add(aditionalBallVelocity[i]);
                    aditionalBall[i].position.copy(aditionalBallPosition[i]);
                }
            }
        }

        elapsedTime += 1 / 75;
    }

    const aditionalMovement = () => {
        if (gameRunning) {
            for (let i = 0; i < aditionalBall.length; i++) {
                if (aditionalBall[i] != null && aditionalBallPosition[i] != null && aditionalBallVelocity[i] != null) {
                    aditionalBallPosition[i].add(aditionalBallVelocity[i]);
                    aditionalBall[i].position.copy(aditionalBallPosition[i]);
                }
            }
        }
    }

    if (aditionalBall != null && aditionalBallPosition != null && aditionalBallVelocity != null) {
        if (elapsedTime < time) {
            accelerateMovement();
        } else {
            aditionalMovement();
        }
    }

    return { aditionalBallPosition }
}