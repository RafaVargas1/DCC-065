import * as THREE from "three";

export const ballMovementHandler = ( ball, ballPosition, ballVelocity, time, elapsedTime, multiplyFactor, startVelocity, gameRunning, gameStart, hitter, gameFinish ) => {
    
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
    
        if (!gameRunning)
            return;
        
        if ( 
            (elapsedTime + 1/60) > Math.ceil(elapsedTime) && 
            elapsedTime <= time && 
            calculateResultantVector(ballVelocity) < (2 * startVelocity) 
        ) {
            ballVelocity.multiplyScalar(multiplyFactor)

            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);

        } else {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
        
        }

     

        elapsedTime += 1/60;
    }


    if (!gameStart && !gameFinish) {
        initialPositioning();
    } else {
        if (elapsedTime < time){
            accelerateMovement();
        } else {
            defaultMovement();
        }
    }

    return { ballPosition, elapsedTime, ballVelocity }
}