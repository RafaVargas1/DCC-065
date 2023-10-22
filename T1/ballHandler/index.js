import * as THREE from "three";

export const ballMovementHandler = ( ball, ballPosition, ballVelocity, time, elapsedTime, startVelocity, gameRunning, gameStart, hitter, gameFinish ) => {
    
    const initialPositioning = () => {
        ball.position.copy(new THREE.Vector3(hitter.position.x, ballPosition.y, 0.6));
    }

    const defaultMovement = () => {
        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }
    }

    const accelerateMovement = () => {
        // if ()
        const targetVelocity = 2 * startVelocity;
        const acceleration = (targetVelocity - startVelocity) / 15; 

        ballVelocity.y += acceleration * (time - elapsedTime);

        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }

        elapsedTime += 1/75;
    }


    if (!gameStart && !gameFinish) {
        initialPositioning();
    } else {
        // if (elapsedTime < time){
        //     accelerateMovement();
        // } else {
            defaultMovement();
        // }
    }

    return { ballPosition, elapsedTime, ballVelocity }
}