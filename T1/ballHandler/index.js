import * as THREE from "three";


export const ballMovementHandler = ( ball, ballPosition, ballVelocity ) => {
    
    const defaultMovement = () => {
        ballPosition.add(ballVelocity);
        ball.position.copy(ballPosition);
    }

    defaultMovement();

    return { ballPosition }
}