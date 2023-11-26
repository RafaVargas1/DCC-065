import * as THREE from "three";

export const perspectiveCameraInitialization = (screenWidth, screenHeight) => {
  const aspect = screenWidth / screenHeight;

  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

  camera.position.copy(new THREE.Vector3(0, 0, 20));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  camera.updateProjectionMatrix();

  return camera;
};
