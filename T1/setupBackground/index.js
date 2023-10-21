import * as THREE from "three";

const buildGameContainer = (screenWidth, screenHeight) => {
  const geometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

  const gamePlatform = new THREE.Mesh(geometry, material);

  return gamePlatform;
};

const buildGameBox = (gameWidth) => {
  const geometry = new THREE.PlaneGeometry(gameWidth, 2 * gameWidth);
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  const gamePlatform = new THREE.Mesh(geometry, material);

  gamePlatform.receiveShadow = true;

  return gamePlatform;
};

export const setupBackground = (
  screenWidth,
  screenHeight,
  gameWidth,
  scene
) => {
  const backgroundContainer = buildGameContainer(screenWidth, screenHeight);
  const backgroundContent = buildGameBox(gameWidth);

  scene.add(backgroundContainer);
  scene.add(backgroundContent);

  return [backgroundContainer, backgroundContent];
};
