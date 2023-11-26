import * as THREE from "three";

export const lightInitialization = (baseScenario) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.position.set(0, 0, 20);

  directionalLight.shadow.camera.top = 15;
  directionalLight.shadow.camera.bottom = -15;
  directionalLight.shadow.camera.left = -8;
  directionalLight.shadow.camera.right = 8;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 20;

  directionalLight.castShadow = true;

  baseScenario.add(ambientLight);
  baseScenario.add(directionalLight);
};
