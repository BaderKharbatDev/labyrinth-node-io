const Game = require('../game_logic/game.js')

module.exports = function(io) {
    const manager = new Manager()

    io.on('connection', (socket) => {

        //connects and adds a user to game
        manager.connectUser(socket)
        if(Object.keys(manager.games).length == 0) { //no game in progress
            let gameKey = manager.createGame()
            manager.startGame(gameKey, io)
            manager.addUserToGame(gameKey, socket.id) //adds to existing game
        } else {
            let keyArray = Object.keys(manager.games)
            let gameKey = manager.games[keyArray[0]]
            manager.addUserToGame(gameKey, socket.id)
        }

        // socket.emit('board-state', map)

        //----------Handles User Entry Data i.e. before joining a lobby
        socket.on('user-info-data', (data)=>{
            
        })

        //----------Handles the lobby leader starting the game
        socket.on('game-start', (data)=>{
            
        })

        //----------Handles User Input during a game
        socket.on('user-input-data', (data)=>{
            let player = this.connections[socket.id]
            let gameKey = player.gameKey
            if(gameKey != null) {
                this.games[gameKey].handleUserData(socket.id, data.KeyInputs)
            }
        })


        socket.on('disconnect', ()=>{
            manager.disconnectUser(socket.id)
        })
    });
}

class Manager {
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
        let temp_id = 1
        let game = new Game(temp_id)
        this.games[game.id] = game
        return game.id
    }

    startGame(gameKey, io) {
        let game = this.games[gameKey]

        game.startGameProcess()
        // game.startSendingDataLoop()
    }

    addUserToGame(gameKey, socketID) {
        this.connections[socketID].gameKey = gameKey
        this.games[gameKey].addPlayer(socketID)
    }

    removeUserFromGame(gameKey, socketID) {
        this.games[gameKey].removePlayer(socketID)
    }
}



