import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const onMouseMove = (event, baseScenario, background, camera, gameRunning, gameStart) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hitter = baseScenario.getObjectByName("hitter");

    const intersects = raycaster.intersectObject(background);

    const hitterMovement = (mouse.x * (14 - (0.225 * 14) - 1.2) / 2);

    if (intersects.length > 0 && (gameRunning || !gameStart)) {
        hitter.position.lerp(new THREE.Vector3(hitterMovement, 1.5 * 14 / -2, 1), 1);
    }
}