import * as THREE from "three";


export const wallColisionHandler = ( ball, wallsMeshArray ) => {
    
    const detectColision = () => {
        const sphere = new THREE.Sphere(ball.position, ball.scale.x); 

        wallsMeshArray.forEach( wall => {
            const box = new THREE.Box3().setFromObject(wall); 

            if (box.intersectsSphere(sphere)){

            }
        })
    }

    detectColision();

    return { }
}