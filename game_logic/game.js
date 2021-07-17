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

        this.grid_size = 15
        this.walls = this.makeMaze(this.grid_size)

        this.parent_game_process = null
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
        this.parent_game_process.send({
            cmd: Game.game_process_child_commands.USER_REMOVED,
            id: socketID
        });
        this.parent_data_process.send({
            cmd: Game.game_process_child_commands.USER_REMOVED,
            id: socketID
        });
        if(this.players.length == 0) {
            this.parent_game_process.kill()
            this.parent_data_process.kill()
        }
    }

    addPlayer(socketID, player_name) {
        let player = new Player(socketID, player_name, null, 1, 1, 0.5)
        this.players[socketID] = player
        this.parent_game_process.send({
            cmd: Game.game_process_child_commands.USER_ADDED,
            id: socketID,
            row: player.row,
            col: player.col,
            playerState: player.playerState,
            keyinputs: player.keyinputs
        });
        this.parent_data_process.send({
            cmd: Game.game_process_child_commands.USER_ADDED,
            id: socketID,
            row: player.row,
            col: player.col,
            name: player.name,
            playerState: player.playerState
        });
    }

    handleUserInputData(socketID, KeyInputs) {
        this.players[socketID].keyinputs = KeyInputs,
        this.parent_game_process.send({
            cmd: Game.game_process_child_commands.USER_INPUT,
            id: socketID,
            keyinputs: KeyInputs
        });
    }

    handleUserPositionData(socketID, row, col, playerState) {
        if(this.players[socketID]){
            if(this.players[socketID].row == row && this.players[socketID].col == col) return

            this.players[socketID].row = row
            this.players[socketID].col = col
            this.players[socketID].playerState = playerState

            this.parent_data_process.send({
                cmd: Game.game_process_child_commands.USER_POSITION,
                id: socketID,
                row: row,
                col: col,
                playerState: playerState
            });
        }   
    }
   
    static game_process_child_commands = {
        START_GAME: 0,
        USER_INPUT: 1,
        USER_ADDED: 2,
        USER_REMOVED:3,
        USER_POSITION: 4
    }

    static game_process_parent_commands = {
        UPDATED_USER_POSITION: 0
    }

    startGame() {
        this.gameState == Game.gameStates.INGAME

        // GAME LOOP
        this.parent_game_process = fork('./game_logic/processes/execute_game_process.js');
        this.parent_game_process.send({
            cmd: Game.game_process_child_commands.START_GAME,
            map: this.walls
        });

        this.parent_game_process.on('message', (data) => {
            switch(data.cmd) {
                case Game.game_process_parent_commands.UPDATED_USER_POSITION:
                    this.handleUserPositionData(data.id, data.row, data.col, data.playerState)
                    break;
            }
        });

        // USER DATA LOOP
        this.parent_data_process = fork('./game_logic/processes/execute_user_data_process.js');
        this.parent_data_process.send({
            cmd: Game.game_process_child_commands.START_GAME,
            map: this.walls,
            gameKey: this.id
        });
    }
}