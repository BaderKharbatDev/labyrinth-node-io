const Game = require('../game_logic/game.js')

module.exports = function(io) {
    const manager = new Manager()

    io.on('connection', (socket) => {

        //connects and adds a user to game
        manager.connectUser(socket)

        //----------Handles when a user joins a global game
        socket.on('player-join-global-game', (data)=> {
            let player_name = data.name

            let gameKey
            if(Object.keys(manager.games).length == 0) { //no game in progress
                gameKey = manager.createGame()
                manager.startGame(gameKey, io)
            } else {
                let keyArray = Object.keys(manager.games)
                gameKey = manager.games[keyArray[0]].id
            }
            manager.addUserToGame(gameKey, socket.id, player_name)
            socket.join(gameKey.toString())
            io.to(gameKey.toString()).emit('init-board-state', {walls: manager.games[gameKey].walls})
        })

        //----------Handles the lobby leader starting the game
        socket.on('game-start', (data)=>{
            let player = manager.connections[socket.id]
            let gameKey = player.gameKey
            if(gameKey != null) {
                io.to(gameKey.toString()).emit('init-board-state', {walls: manager.games[gameKey].walls})
            }
        })

        //----------Handles User Input during a game
        socket.on('user-input-data', (data)=>{
            let player = manager.connections[socket.id]
            let gameKey = player.gameKey
            if(gameKey != null) {
                manager.games[gameKey].handleUserInputData(socket.id, data.keyinputs)
            }
        })


        socket.on('disconnect', ()=>{
            manager.disconnectUser(socket.id)
        })
    });
}

class Manager {
    static game_id_counter = 1

    constructor() {
        this.connections = {}
        this.games = {}
    }

    connectUser(socket) {
        console.log('A user connected: '+socket.id);
        this.connections[socket.id] = socket
    }
    
    disconnectUser(socketID) {
        console.log('A user disconnected: '+socketID)
        let playerGameID = this.connections[socketID].gameKey
        if(playerGameID != null) {
            this.removeUserFromGame(playerGameID, socketID) //removes player from game
            if(Object.keys(this.games[playerGameID].players).length == 0) {
                delete this.games[playerGameID]              //deletes game if empty
            }
        }
        delete this.connections[socketID]                           //deletes socket from connections
    }

    createGame() {
        let temp_id = Manager.game_id_counter
        Manager.game_id_counter++

        let game = new Game(temp_id)
        this.games[game.id] = game
        return game.id
    }

    startGame(gameKey) {
        let game = this.games[gameKey]
        game.startGame()
    }

    addUserToGame(gameKey, socketID, player_name) {
        this.connections[socketID].gameKey = gameKey
        this.games[gameKey].addPlayer(socketID, player_name)
    }

    removeUserFromGame(gameKey, socketID) {
        this.games[gameKey].removePlayer(socketID)
    }
}



