import * as THREE from "three";

const loadSkyBox = () => {
  const path = "./assets/skybox1/"

  const format = ".png";

  const urls = [
    path + "right" + format,
    path + "left" + format,
    path + "top" + format,
    path + "bottom" + format,
    path + "front" + format,
    path + "back" + format,
  ];

  const cubeMapTexture = new THREE.CubeTextureLoader().load(urls);
  return cubeMapTexture;
}

const buildGameContainer = (screenWidth, screenHeight) => {
  const geometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

  const gamePlatform = new THREE.Mesh(geometry, material);

  return gamePlatform;
};

const buildGameBox = (gameWidth) => {
  const geometry = new THREE.PlaneGeometry(gameWidth, 2 * gameWidth);
  const material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

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

  const skybox = loadSkyBox();
  scene.background = skybox;

  const backgroundContainer = buildGameContainer(screenWidth, screenHeight);
  const backgroundContent = buildGameBox(gameWidth);

  scene.add(backgroundContainer);
  scene.add(backgroundContent);

  return [backgroundContainer, backgroundContent];
};
