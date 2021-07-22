const Game = require('../game.js')
const { Player } = require('../entity.js')

const process_helper = {
    loop_going: true,
    players: {},
    map: {},
    end_tiles: []
}

process.on('message', async (data) => {
    switch(data.cmd) {
        case Game.game_process_child_commands.START_GAME:
            process_helper.map = data.map
            process_helper.gameKey = data.gameKey
            if(data.players) {
                let keys =  Object.keys(data.players)
                for(var i = 0; i < keys.length; i++) {
                    let player = data.players[keys[i]]
                    process_helper.players[player.id] = {
                        name:player.name,
                        row:player.row,
                        col:player.col,
                        playerState:player.playerState,
                        keyinputs: player.keyinputs
                    }
                }
            }
            if(data.map) {
                for(var r = 0; r < process_helper.map.length; r++) {
                    for(var c = 0; c < process_helper.map.length; c++) {
                        let tile = process_helper.map[r][c]
                        if(tile.isEnd == true) {
                            process_helper.end_tiles.push(tile)
                        }
                    }
                }
            }
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
        case Game.game_process_child_commands.RESET_MAP:
            if(data.map) {
                process_helper.map = data.map
                for(var r = 0; r < process_helper.map.length; r++) {
                    for(var c = 0; c < process_helper.map.length; c++) {
                        let tile = process_helper.map[r][c]
                        if(tile.isEnd == true) {
                            process_helper.end_tiles.push(tile)
                        }
                    }
                }
            }
            Loop()
            break;
    }
});

async function Loop() {
    let second = 1000
    let tickRate = second/200
    while(process_helper.loop_going) {

        //process player movements
        processPlayersMovement(tickRate)

        //check for win condition
        let check = checkForWinCondition()
        // console.log(check)
        if(check.condition_met==true) {
            resetBoardState()
            break
        }

        await sleep(tickRate)
    }
}

async function resetBoardState() {                                  //NOTIFYS ALL PLAYERS OF INDIVIDUAL UPDATED PLAYER POSITION
    process_helper.end_tiles = []

    //resets player positions
    let reset_row = 1, reset_col = 1
    for (const [key, player] of Object.entries(process_helper.players)) {
        player.row = reset_row,
        player.col = reset_col
    }

    process.send({
        cmd: Game.game_process_parent_commands.RESET_BOARD_STATE
    });
}

function checkForWinCondition() {                                           //CHECK FOR WIN CONDITION
    let win_condition = false
    let winning_players = []

    let player_size = 0.5, block_size = 1
    for (const [key, player] of Object.entries(process_helper.players)) {
        for (var i = 0; i < process_helper.end_tiles.length; i++) {
            let tile = process_helper.end_tiles[i]
            if(Intersect({
                x: player.col,
                y: player.row,
                height: player_size,
                width: player_size
            },{
                x: tile.col,
                y: tile.row,
                height: block_size,
                width: block_size
            })) {
                win_condition = true
                winning_players.push(key)
                break;
            }
        } 
    }

    return {
        condition_met: win_condition,
        condition_players: winning_players
    }
}

async function processPlayersMovement(tickRate) {                                            //PROCESSES PLAYER MOEVEMENT
    if(Object.keys(process_helper.players).length != 0) {  
        for (var id in process_helper.players) {
            updateUserPosition(id, process_helper.players[id].keyinputs, tickRate)
            sendParentUpdatedUserPosition(id)
        }
    }
}

async function sendParentUpdatedUserPosition(id) {                                  //NOTIFYS ALL PLAYERS OF INDIVIDUAL UPDATED PLAYER POSITION
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

async function updateUserPosition(socketID, KeyInputs, tick_rate) {
    const previous_row_pos = process_helper.players[socketID].row
    const previous_col_pos = process_helper.players[socketID].col
    
    let dps = 10//20
    let dist = dps*2 * (tick_rate/1000)

    let new_col, new_row

    if(KeyInputs.left && !KeyInputs.right) { //left
        new_col = process_helper.players[socketID].col - dist
    } else if(!KeyInputs.left && KeyInputs.right) { //right
        new_col = process_helper.players[socketID].col + dist
    }

    if(new_col && !isPositionCollidingWithMap(process_helper.players[socketID].row, new_col)) {
        process_helper.players[socketID].col = new_col
    }

    if(KeyInputs.up && !KeyInputs.down) { //up
        new_row = process_helper.players[socketID].row - dist
    } else if(!KeyInputs.up && KeyInputs.down) { //down
        new_row = process_helper.players[socketID].row + dist
    }

    if(new_row && !isPositionCollidingWithMap(new_row, process_helper.players[socketID].col)) {
        process_helper.players[socketID].row = new_row
    }

    const current_row_pos = process_helper.players[socketID].row
    const current_col_pos = process_helper.players[socketID].col

    if(previous_col_pos == current_col_pos && previous_row_pos == current_row_pos) {
        process_helper.players[socketID].playerState = Player.playerStates.RUNNING
    } else {
        process_helper.players[socketID].playerState = Player.playerStates.IDLE 
    }
}

function isPositionCollidingWithMap(row, col) {
    let player_size = 0.5, block_size = 1
    let rounded_row = Math.floor(row), rounded_col = Math.floor(col)
    
    for(var r = rounded_row-1; r <= rounded_row+1; r++) {
        for(var c = rounded_col-1; c <= rounded_col+1; c++) {
            try {
                if(process_helper.map[r][c].collidable == true) {
                    if(Intersect({
                        x: col,
                        y: row,
                        height: player_size,
                        width: player_size
                    },{
                        x: c,
                        y: r,
                        height: block_size,
                        width: block_size
                    })) {
                        return true
                    }
                }
            } catch(err) {
                continue
            }
        }
    }
    return false
}

function Intersect(rect1,rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
         return true
     }
     return false
}