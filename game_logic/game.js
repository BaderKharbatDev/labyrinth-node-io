const {Tile, Player, KeyInputs} = require('./entity.js')
const Maze = require('./maze.js')

const ws = require('ws');
const io = new ws.Server({ noServer: true });

const client_constants = {
    SHOW_GAME: 'game-starting',
    SHOW_LOBBY: 'show-lobby',
    UPDATE_LOBBY: 'update-lobby',
    UPDATE_BOARD: 'update-board-state',
    INIT_BOARD: 'init-board-state'
}

module.exports = class Game {
    static gameStates = {
        LOBBY: 0,
        INGAME: 1,
        FINISHED: 2
    }

    constructor(id) {
        this.id = id
        this.players = {}
        this.clients = {}
        this.gameState = Game.gameStates.LOBBY

        this.grid_size = 10
        this.generateMap(this.grid_size)

        this.game_process = null

        let second = 1000
        let fps = 20
        let tickRate = second/fps
        this.tickRate = tickRate
    }

    generateMap(size) {
        this.tiles = this.makeMaze(size)
        this.endTile = this.setEndTiles()
    }

    makeMaze(size) {
        let half_size = size
        let full_size = 2*half_size+1
        var m = new Maze(half_size)
        m.initBlankMaze()
        m.generateMaze()
        return m.getObstacleArray()
    }

    setEndTiles() {
        this.end_tiles = []
        for(var r = 0; r < this.tiles.length; r++) {
            for(var c = 0; c < this.tiles.length; c++) {
                let tile = this.tiles[r][c]
                if(tile.isEnd == true) {
                    this.end_tiles.push(tile)
                }
            }
        }
    }

    removePlayer(socketID) {
        delete this.players[socketID]
        delete this.clients[socketID]
        if(this.gameState == Game.gameStates.INGAME) { //IF IN GAME SEND PLAYER DATA
            if(this.players.length == 0) { ///KILLS GAME PROCESSES
                this.endGame()
            }
        }
    }

    addPlayer(socket, player_name) {
        let player = new Player(socket.id, player_name, null, 1, 1, 0.5)
        this.players[socket.id] = player
        this.clients[socket.id] = socket
        if(this.gameState == Game.gameStates.INGAME) {
            let packet = {
                cmd: client_constants.INIT_BOARD,
                map: this.tiles
            }
            socket.send(JSON.stringify(packet))
        }
    }

    handleUserInputData(socketID, KeyInputs) {
        this.players[socketID].keyinputs = KeyInputs
    }

    handleUserPositionData(socketID, row, col, playerState) {
        if(this.players[socketID]){
            if(this.players[socketID].row == row && this.players[socketID].col == col) return

            this.players[socketID].row = row
            this.players[socketID].col = col
            this.players[socketID].playerState = playerState
        }   
    }

    startGame() {
        let packet = {
            cmd: client_constants.INIT_BOARD,
            map: this.tiles
        }
        let game_client_list = this.clients
        for (var id in game_client_list){
            game_client_list[id].send(JSON.stringify(packet))
        }

        this.gameState = Game.gameStates.INGAME

        let _this = this
        this.game_process = setInterval(function() {
            _this.classicGameLoop(_this)
        }, this.tickRate)
    }   

    endGame() {
        clearInterval(this.game_process)
    }

    classicGameLoop(_this) {
        //process player movements

        _this.processPlayersMovement(_this)

        //check for win condition
        let check = _this.checkForWinCondition(_this)
        if(check.condition_met==true) {
            _this.resetBoardState(_this)
            _this.endGame(_this)
        }

        let packet = {
            cmd: client_constants.UPDATE_BOARD,
            players: _this.players
        }
        let game_client_list = this.clients
        for (var id in game_client_list){
            game_client_list[id].send(JSON.stringify(packet))
        }
    }

    // GAME PROCESS HELPERS
    resetBoardState(_this) {   
        //resets player positions
        let reset_row = 1, reset_col = 1
        for (const [key, player] of Object.entries(_this.players)) { //reset player pos
            player.row = reset_row,
            player.col = reset_col
        }
        _this.generateMap(_this.grid_size)                            //reset new map
        _this.startGame()
    }
    
    processPlayersMovement(_this) {                                            //PROCESSES PLAYER MOEVEMENT
        if(Object.keys(_this.players).length != 0) {  
            for (var id in _this.players) {
                _this.updateUserPosition(_this, id, _this.players[id].keyinputs, _this.tickRate)
            }
        }
    }
    
    checkForWinCondition(_this) {                                           
        let win_condition = false
        let winning_players = []
    
        let player_size = 0.5, block_size = 1
        for (const [key, player] of Object.entries(_this.players)) {
            for (var i = 0; i < _this.end_tiles.length; i++) {
                let tile = _this.end_tiles[i]
                if(_this.Intersect({
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
    
    updateUserPosition(_this, socketID, KeyInputs, tick_rate) {
        const previous_row_pos = _this.players[socketID].row
        const previous_col_pos = _this.players[socketID].col
        
        let dps = 10 //20
        let dist = dps*2 * (tick_rate/1000)
    
        let new_col, new_row
    
        if(KeyInputs.left && !KeyInputs.right) { //left
            new_col = _this.players[socketID].col - dist
        } else if(!KeyInputs.left && KeyInputs.right) { //right
            new_col = _this.players[socketID].col + dist
        }
    
        if(new_col && !_this.isPositionCollidingWithMap(_this, _this.players[socketID].row, new_col)) {
            _this.players[socketID].col = new_col
        }
    
        if(KeyInputs.up && !KeyInputs.down) { //up
            new_row = _this.players[socketID].row - dist
        } else if(!KeyInputs.up && KeyInputs.down) { //down
            new_row = _this.players[socketID].row + dist
        }
    
        if(new_row && !_this.isPositionCollidingWithMap(_this, new_row, _this.players[socketID].col)) {
            _this.players[socketID].row = new_row
        }
    
        const current_row_pos = _this.players[socketID].row
        const current_col_pos = _this.players[socketID].col
    
        if(previous_col_pos == current_col_pos && previous_row_pos == current_row_pos) {
            _this.players[socketID].playerState = Player.playerStates.RUNNING
        } else {
            _this.players[socketID].playerState = Player.playerStates.IDLE 
        }
    }
    
    isPositionCollidingWithMap(_this, row, col) {
        let player_size = 0.5, block_size = 1
        let rounded_row = Math.floor(row), rounded_col = Math.floor(col)
        
        for(var r = rounded_row-1; r <= rounded_row+1; r++) {
            for(var c = rounded_col-1; c <= rounded_col+1; c++) {
                try {
                    if(_this.tiles[r][c].collidable == true) {
                        if(_this.Intersect({
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
    
    Intersect(rect1,rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
             return true
         }
         return false
    }
}