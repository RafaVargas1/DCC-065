import * as THREE from "three";

export const setupAudio = (listener) => {
    let audioLoader = new THREE.AudioLoader();

    const hitterColision = new THREE.Audio(listener);
    const brickColision = new THREE.Audio(listener);
    const doubleHitBrickColision = new THREE.Audio(listener);
    const powerUpBrickColision = new THREE.Audio(listener);

    audioLoader.load("../../../assets/sounds/rebatedor.mp3", function (buffer) {
        hitterColision.setBuffer(buffer);
        hitterColision.setLoop(false);
        hitterColision.setVolume(0.5);
    });
    audioLoader.load("../../../assets/sounds/bloco1.mp3", function (buffer) {
        brickColision.setBuffer(buffer);
        brickColision.setLoop(false);
        brickColision.setVolume(0.5);
    });
    audioLoader.load("../../../assets/sounds/bloco2.mp3", function (buffer) {
        doubleHitBrickColision.setBuffer(buffer);
        doubleHitBrickColision.setLoop(false);
        doubleHitBrickColision.setVolume(0.5);
    });
    audioLoader.load("../../../assets/sounds/bloco3.mp3", function (buffer) {
        powerUpBrickColision.setBuffer(buffer);
        powerUpBrickColision.setLoop(false);
        powerUpBrickColision.setVolume(0.5);
    });

    return { hitterColision, brickColision, doubleHitBrickColision, powerUpBrickColision }
};