const Players = require('entity.js').Player

export default class Game {
    static gameStates = {
        LOBBY: 0,
        INGAME: 1,
        FINISHED: 2
    }

    constructor(id) {
        this.id = id
        this.players = []
        this.gameState = gameStates.LOBBY

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
        let player = new Players(socketID, "name", null, 1, 1, 0.5)
        this.players[socketID] = player
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }   

    //Handles the game data per tick i.e. moving the player and checking for win condition
    gameLoop() {
        let tickRate = 1000/200
        while(this.gameState = gameStates.INGAME) {
            //TODO for each player in game handle their user data
            await this.sleep(tickRate)
        }
    }

    //Handles sending the game data 
    sendGameData() {
        let tickRate = 1000/40
        while(this.gameState = gameStates.INGAME) {
            await this.sleep(tickRate)
        }
    }

    handleUserData(socketID, KeyInputs) {
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
   
}