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

function pause() {

}

function reset() {
    
}

var keyboard = new KeyboardState();

export const keyboardUpdate = (canvas) => {
    keyboard.update();

    if (keyboard.down("enter")) toggleFullscreen(canvas);
    if (keyboard.down("space")) pause();
    if (keyboard.down("R")) reset();
}