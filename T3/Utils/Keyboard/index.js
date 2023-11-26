import KeyboardState from '../../../libs/util/KeyboardState.js'

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

var keyboard = new KeyboardState();

export const keyboardUpdate = (canvas, gameRunning, gameStart, baseScenario, mustInitialize, changeStage) => {   
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

    return { gameRunning };
}