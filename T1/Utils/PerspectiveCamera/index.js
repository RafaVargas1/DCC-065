import * as THREE from "three";

export const perspectiveCameraInitialization = (screenWidth, screenHeight) => {
    const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.1, 1000);
    camera.position.z = 20;

    return camera;
}