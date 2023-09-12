export const checkGame = ( bricksMatrix, gameRunning, gameStart, gameFinish ) => {
    let mustPause = true;

    bricksMatrix.forEach(brickrow => {
        brickrow.forEach(brick => {
            if (brick.name != "broken") {
                mustPause = false;
            }
        })
    });

    if (mustPause) {
        gameRunning = false;
        gameStart = false;
        gameFinish = true;
    }

    return { gameRunning, gameStart, gameFinish }
}