export const ballMovementHandler = ( ball, ballPosition, ballVelocity, gameRunning ) => {
    
    const defaultMovement = () => {
        if (gameRunning) {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        }
    }

    defaultMovement();

    return { ballPosition }
}