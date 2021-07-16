const Game = require('../game.js')
const { Player } = require('../entity.js')

const process_helper = {
    loop_going: true,
    players: {},
    map: {}
}

process.on('message', async (data) => {
    switch(data.cmd) {
        case Game.game_process_child_commands.START_GAME:
            process_helper.map = data.map
            Loop()
            break;
        case Game.game_process_child_commands.USER_INPUT:
            if(process_helper.players[data.id]) {
                process_helper.players[data.id].keyinputs = data.keyinputs
            }
            break;
        case Game.game_process_child_commands.USER_ADDED:
            process_helper.players[data.id] = {
                row:data.row,
                col:data.col,
                playerState:data.playerState,
                keyinputs: data.keyinputs
            }
            break;
        case Game.game_process_child_commands.USER_REMOVED:
            delete process_helper.players[data.id]
            break;
    }
});

async function Loop() {
    let second = 1000
    let tickRate = second/200
    while(process_helper.loop_going) {
        if(Object.keys(process_helper.players).length != 0) {
            for (var id in process_helper.players) {
                updateUserPosition(id, process_helper.players[id].keyinputs)
                sendParentUpdatedUserPosition(id)
            }
        }
        await sleep(tickRate)
    }
}

async function sendParentUpdatedUserPosition(id) {
    process.send({
        cmd: Game.game_process_parent_commands.UPDATED_USER_POSITION,
        id: id,
        row: process_helper.players[id].row,
        col: process_helper.players[id].col
    });
  
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function updateUserPosition(socketID, KeyInputs) {
    const previous_row_pos = process_helper.players[socketID].row
    const previous_col_pos = process_helper.players[socketID].col
    
    // process_helper.players[socketID].keyinputs = KeyInputs
    if(KeyInputs.left && !KeyInputs.right) { //left

    } else if(!KeyInputs.left && KeyInputs.right) { //right

    }
    if(KeyInputs.up && !KeyInputs.down) { //up

    } else if(!KeyInputs.up && KeyInputs.down) { //down

    }

    const current_row_pos = process_helper.players[socketID].row
    const current_col_pos = process_helper.players[socketID].col
    if(previous_col_pos == current_col_pos && previous_row_pos == current_row_pos) {
        process_helper.players[socketID].playerState = Player.playerStates.RUNNING
    } else {
        process_helper.players[socketID].playerState = Player.playerStates.IDLE 
    }
}