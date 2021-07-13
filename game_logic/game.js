const { fork } = require('child_process');
const {Tile, Player, KeyInputs} = require('./entity.js')
const Maze = require('./maze.js')

module.exports = class Game {
    static gameStates = {
        LOBBY: 0,
        INGAME: 1,
        FINISHED: 2
    }

    constructor(id) {
        this.id = id
        this.players = {}
        this.gameState = Game.gameStates.LOBBY

        this.grid_size
        this.walls   
    }

    makeMaze(size) {
        let half_size = size
        let full_size = 2*half_size+1
        var m = new Maze(half_size)
        m.initBlankMaze()
        m.generateMaze()
        return m.getObstacleArray()
    }

    removePlayer(socketID) {
        delete this.players[socketID]
    }

    addPlayer(socketID) {
        let player = new Player(socketID, "name", null, 1, 1, 0.5)
        this.players[socketID] = player
    }


    // //Handles the game data per tick i.e. moving the player and checking for win condition
    // async gameLoop() {
    //     let tickRate = 1000/200
    //     while(this.gameState = gameStates.INGAME) {
    //         for (const [id, player] of Object.entries(this.players)) {
    //             this.updateUserPosition(id, player.keyinputs)
    //         }
    //         await this.sleep(tickRate)
    //         console.log('processing game data')
    //     }
    // }

    // //Handles sending the game data 
    // async sendGameDataLoop() {
    //     let tickRate = 1000/40
    //     while(this.gameState = gameStates.INGAME) {
    //         console.log('sending game data')
    //         await this.sleep(tickRate)
    //     }
    // }

    handleUserInputData(socketID, KeyInputs) {
        this.players[socketID].keyinputs = KeyInputs
    }

    handleUserPositionData(socketID, row, col, playerState) {
        if(this.players[socketID]){
            this.players[socketID].row = row
            this.players[socketID].col = col
            this.players[socketID].playerState = playerState
        }
    }

    updateUserPosition(socketID, KeyInputs) {
        const previous_row_pos = this.players[socketID].row
        const previous_col_pos = this.players[socketID].col
        
        this.players[socketID].keyinputs = KeyInputs
        if(KeyInputs.left && !KeyInputs.right) { //left

        } else if(!KeyInputs.left && KeyInputs.right) { //right

        }
        if(KeyInputs.up && !KeyInputs.down) { //up

        } else if(!KeyInputs.up && KeyInputs.down) { //down

        }

        const current_row_pos = this.players[socketID].row
        const current_col_pos = this.players[socketID].col
        if(previous_col_pos == current_col_pos && previous_row_pos == current_row_pos) {
            this.players[socketID].playerState = Players.playerStates.RUNNING
        } else {
            this.players[socketID].playerState = Players.playerStates.IDLE 
        }
    }
   
    static game_process_child_commands = {
        START_GAME: 0
    }

    static game_process_parent_commands = {
        UPDATED_USER_POSITION: 0
    }

    startGame() {
        const process = fork('./game_logic/processes/execute_game_process.js');
        process.send({cmd: Game.game_process_child_commands.START_GAME});

        process.on('message', (data) => {
            switch(data.cmd) {
                case Game.game_process_parent_commands.UPDATED_USER_POSITION:
                    this.handleUserPositionData(data.row, data.col, data.playerState)
                    break;
            }
        });
    }
}