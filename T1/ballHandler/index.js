import * as THREE from "three";

export const ballMovementHandler = ( ball, ballPosition, ballVelocity, gameRunning, gameStart, hitter, gameFinish ) => {
    
    const initialPositioning = () => {
        ball.position.copy(new THREE.Vector3(hitter.position.x, ballPosition.y, 0.6));
    }

    const defaultMovement = () => {
        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }
    }

    if (!gameStart && !gameFinish) {
        initialPositioning();
    } else {
        defaultMovement();
    }

    return { ballPosition }
}