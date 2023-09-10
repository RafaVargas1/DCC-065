import * as THREE from "three";

export const wallColisionHandler = ( ball, wallsMeshArray, ballVelocity ) => {
    
    const calculateReflection = (wallIndex) => {
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

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x); 

        wallsMeshArray.forEach( (wall, wallIndex )=> {
            const boxCollided = new THREE.Box3().setFromObject(wall); 

            if (boxCollided.intersectsSphere(sphere)){
                calculateReflection(wallIndex);
            }
        })
    }

    detectColision();

    return {  ballVelocity }
}

export const hitterColisionHandler = () => {

    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x); 

        wallsMeshArray.forEach( (wall, wallIndex )=> {
            const boxCollided = new THREE.Box3().setFromObject(wall); 

            if (boxCollided.intersectsSphere(sphere)){
                calculateReflection(wallIndex);
            }
        })
    }

    detectColision();
}