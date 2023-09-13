import * as THREE from "three";

export const ballMovementHandler = ( ball, ballPosition, ballVelocity, gameRunning, gameStart, hitter ) => {
    
    const initialPositioning = () => {
        ball.position.copy(new THREE.Vector3(hitter.position.x, ballPosition.y, 0));
    }

    const defaultMovement = () => {
        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }
    }

    if (!gameStart) {
        initialPositioning();
    } else {
        defaultMovement();
    }

    return { ballPosition }
}