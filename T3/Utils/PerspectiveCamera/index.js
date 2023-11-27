import * as THREE from "three";

export const perspectiveCameraInitialization = (screenWidth, screenHeight, initialPosition) => {
  const aspect = (screenWidth  / screenHeight) * 0.79;
  const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
  camera.position.copy(initialPosition);
  camera.lookAt(0, 0, 0)

  camera.updateProjectionMatrix();
 
  return camera;
};
