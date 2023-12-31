import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const onMouseMove = (
  event,
  baseScenario,
  camera,
  gameRunning,
  gameStart,
  gameFinish
) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hitter = baseScenario.getObjectByName("hitter");

  const intersects = raycaster.intersectObject(baseScenario);

  if (intersects.length > 0 && (gameRunning || !gameStart) && !gameFinish) {
    let hitterMovement = intersects[0].point.x;

    if (hitterMovement > 5) {
      hitterMovement = 5;
    } else if (hitterMovement < -5) {
      hitterMovement = -5;
    }

    hitter.position.lerp(
      new THREE.Vector3(hitterMovement, (3.1 * 14) / -2, 0.8),
      1
    );
  }
};
