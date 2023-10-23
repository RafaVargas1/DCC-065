import * as THREE from "three";

export const ballMovementHandler = ( ball, ballPosition, ballVelocity, time, elapsedTime, multiplyFactor, startVelocity, timesIncreased, gameRunning, gameStart, hitter, gameFinish ) => {
    
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
    
        if (!gameRunning)
            return;

       
        const integerPart = Math.trunc(elapsedTime + 1/75);
        const decimalPart = elapsedTime - integerPart; 

        
        if (elapsedTime + 1/75 > Math.ceil(elapsedTime)) {
            timesIncreased = 0;
        }

        if ( 
            ((decimalPart) > (1/(timesInASecond + 1) * timesIncreased)) && 
            (elapsedTime <= time) && 
            (calculateResultantVector(ballVelocity) < (2 * startVelocity)) 
        ) {
            // console.log("entrou")
            ballVelocity.multiplyScalar(multiplyFactor)

            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);
   
            timesIncreased++; 
        } else {
            ballPosition.add(ballVelocity);
            ball.position.copy(ballPosition);        
        }

     

        elapsedTime += 1/75;
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

    return { ballPosition, elapsedTime, ballVelocity, timesIncreased }
}