import KeyboardState from '../../../libs/util/KeyboardState.js'
import { perspectiveCameraInitialization } from '../PerspectiveCamera/index.js'
import { OrbitControls } from '../../../build/jsm/controls/OrbitControls.js'

function toggleFullscreen(canvas) {
    if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) { 
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) { 
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { 
            canvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function reset(baseScenario) {
    while (baseScenario.children.length > 0) {
        const object = baseScenario.children[0];
        baseScenario.remove(object);
    }
}

const handleOrbitContorol = (controls) => {
    controls.enabled = !controls.enabled;
    controls.enableZoom = !controls.enableZoom;  
  }

var keyboard = new KeyboardState();

export const keyboardUpdate = (canvas, gameRunning, gameStart, baseScenario, mustInitialize, changeStage, camera, cameraPosition, controls, renderer) => {   
    keyboard.update();

    if (keyboard.down("enter")) {
        toggleFullscreen(canvas);
    }

    if (keyboard.down("space") && gameStart) {
        gameRunning = !gameRunning;
    }

    if (keyboard.down("R")) {
        reset(baseScenario);        
        window.dispatchEvent(mustInitialize);
        gameRunning = false;
    }

    if (keyboard.down("G")){   
        reset(baseScenario);            
        window.dispatchEvent(changeStage);
        gameRunning = false;
    }

    if (keyboard.down("O")){
        handleOrbitContorol(controls);
        let auxIsEnableOrbitControl = controls.enableZoom;

        gameRunning = !auxIsEnableOrbitControl;

        if (!auxIsEnableOrbitControl) { 
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            camera = perspectiveCameraInitialization(screenWidth, screenHeight, cameraPosition)
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = auxIsEnableOrbitControl;
            controls.enabled = auxIsEnableOrbitControl;
        }

    }

    return { gameRunning, camera, controls };
}