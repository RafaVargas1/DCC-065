export const checkGame = ( bricksMatrix, gameRunning, gameStart, gameFinish, actualStage, changeStage, baseScenario ) => {
    let mustPause = true;

    bricksMatrix.forEach(brickrow => {
        brickrow.forEach(brick => {
            if (brick.name != "broken") {
                mustPause = false;
            }
        })
    });

    if (mustPause && (actualStage == 1)) {
        gameRunning = false;
        gameStart = false;
        
        while (baseScenario.children.length > 0) {
            const object = baseScenario.children[0];
            baseScenario.remove(object);
        }

        window.dispatchEvent(changeStage);
    }

    if (mustPause && (actualStage == 2)) {
        gameRunning = false;
        gameStart = false;
        gameFinish = true;
    }

    return { gameRunning, gameStart, gameFinish }
}