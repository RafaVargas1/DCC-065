import * as THREE from "three";

function changeDirection(vector, inclination, azimuth) {
    const radius = vector.length(); // Obtém o comprimento do vetor

    // Converte coordenadas esféricas para cartesianas
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.sin(inclination) * Math.sin(azimuth);
    
    // Retorna o novo vetor com a mesma magnitude (comprimento)
    return new THREE.Vector3(x, y, 0);
}

export const wallColisionHandler = ( ball, wallsMeshArray, ballVelocity ) => {
    
    const calculateWallReflection = (wallIndex) => {
        let normal;

        switch (wallIndex){
            case 0:
                normal = new THREE.Vector3(-1, 0, 0);
                break;
            case 1:
                normal = new THREE.Vector3(1, 0, 0);
                break;

            case 2:
                normal = new THREE.Vector3(0, -1, 0);
                break;

        }
        const incidentVector = ballVelocity;
        const reflectionVector = incidentVector.clone().sub(normal.clone().multiplyScalar(2 * incidentVector.dot(normal)));
        ballVelocity = reflectionVector;
    }

    const detectWallColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x); 

        wallsMeshArray.forEach( (wall, wallIndex )=> {
            const boxCollided = new THREE.Box3().setFromObject(wall); 

            if (boxCollided.intersectsSphere(sphere)){
                calculateWallReflection(wallIndex);
            }
        })
    }

    detectWallColision();

    return {  ballVelocity }
}

export const hitterColisionHandler = (ball, ballVelocity, hitter) => {
    
    const calculateHitterReflection = (hitterIndex) => {
        let normal;

        let reflectionAngle;
        
        reflectionAngle = ((hitterIndex + 1) * -1) * Math.PI / 6;

        const reflectionDirection = new THREE.Vector3(Math.cos(reflectionAngle), Math.sin(reflectionAngle), 0);

        const velocity = ballVelocity; 
        const dotProduct = velocity.dot(reflectionDirection);
        const reflectionVector = velocity.clone().sub(reflectionDirection.clone().multiplyScalar(2 * dotProduct));

        ballVelocity = reflectionVector;
        ballVelocity.y = Math.abs(reflectionVector.y)
    }


    const detectHitterColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x); 

        hitter.updateMatrixWorld() 

        hitter.children.forEach( (hitterPart, index )=> {
            const boxCollided = new THREE.Box3().setFromObject(hitterPart); 

            if (boxCollided.intersectsSphere(sphere)){
                calculateHitterReflection(index);
            }
        })
    }

    detectHitterColision();

    return { ballVelocity }
}

