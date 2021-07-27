var server = require('http').createServer();
var io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

const Game = require('../game.js')
const { Player } = require('../entity.js')


const process_helper = {
    loop_going: false,
    players: {},
    map: {},
    gameKey: null
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
            Loop()
            break;
        case Game.game_process_child_commands.USER_POSITION:
            process_helper.players[data.id].row = data.row
            process_helper.players[data.id].col = data.col
            process_helper.players[data.id].playerState = data.playerState
            break;
        case Game.game_process_child_commands.USER_ADDED:
            process_helper.players[data.id] = {
                name:data.name,
                row:data.row,
                col:data.col,
                playerState:data.playerState
            }
            if(process_helper.loop_going) {
                io.to(data.id).emit('init-board-state', { //imit init board state
                    map: process_helper.map
                })
            }
            break;
        case Game.game_process_child_commands.USER_REMOVED:
            delete process_helper.players[data.id]
            break;
            case Game.game_process_child_commands.RESET_MAP:
                if(data.map) {
                    process_helper.map = data.map
                    process_helper.loop_going = false
                    await sleep(100)
                    process_helper.loop_going = true
                }
                Loop()
                break;
    }
});

async function Loop() {
    io.to(process_helper.gameKey.toString()).emit('init-board-state', { //imit init board state
        map: process_helper.map
    })

    process_helper.loop_going = true
    let second = 1000
    let tickRate = second/100
    while(process_helper.loop_going) {
        io.to(process_helper.gameKey.toString()).emit('update-board-state', { //emit player location/board status
            players: process_helper.players,
            // walls: process_helper.map
        })
        await sleep(tickRate)
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

