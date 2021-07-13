const Game = require('../game.js')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

process.on('message', async (data) => {
    switch(data.cmd) {
        case Game.game_process_commands.START_GAME:
            startLoop()
            break;
    }
});

function startLoop() {
    let second = 1000
    let tickRate = second/200
    // while(this.gameState = gameStates.INGAME) {
    //     for (const [id, player] of Object.entries(this.players)) {
    //         this.updateUserPosition(id, player.keyinputs)
    //     }
    //     await this.sleep(tickRate)
    //     console.log('processing game data')
    // }
    let count = 0
    while(true) {
        console.log(count)
        count++
    }
}