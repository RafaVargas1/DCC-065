import * as THREE from "three";

export const orthographicCameraInitialization = (screenWidth, screenHeight) => {
  const aspect = screenWidth / screenHeight;
  const width = 60;
  const height = width / aspect;

  const camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    -1000,
    1000
  );

  camera.position.set(0, 0, 0);
  camera.zoom = 1;

  camera.updateProjectionMatrix();

  return camera;
};
