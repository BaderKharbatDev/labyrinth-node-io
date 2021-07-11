const Maze = require('../game_logic/maze.js')
const Game = require('../game_logic/game.js')

module.exports = function(io) {
    const manager = new Manager()

    io.on('connection', (socket) => {

        manager.connectUser(socket)
        if(manager.games.length == 0) {
            let gameKey = manager.createGame()
            manager.addUserToGame(gameKey, socketID)
        }

        socket.emit('board-state', map)

        //----------Handles User Entry Data i.e. before joining a lobby
        socket.on('user-info-data', (data)=>{

        })

        //----------Handles the lobby leader starting the game
        socket.on('game-start', (data)=>{
            
        })

        //----------Handles User Input during a game
        socket.on('user-input-data', (data)=>{

        })


        socket.on('disconnect', ()=>{
            manager.disconnectUser(socket.id)
        })
    });
}

class Manager {
    constructor() {
        this.connections = []
        this.games = []
    }

    connectUser(socket) {
        console.log('A user connected: '+socket.id);
        connections[socket.id] = socket
    }
    
    disconnectUser(socket) {
        console.log('A user disconnected: '+socket.id)
        let playerGameID = this.connections[socket.id].gameKey
        if(playerGameID != null) {
            manager.removeUserFromGame(playerGameID, socket.id) //removes player from game
            if(manager.games[playerGameID].players.length == 0) {
                delete manager.games[playerGameID]              //deletes game if empty
            }
        }
        delete connections[socket.id]                           //deletes socket from connections
    }

    createGame() {
        let temp_id = 1
        let game = new Game(temp_id)
        this.games[game.id] = game
        return game.id
    }

    addUserToGame(gameKey, socketID) {
        this.connections[socketID].gameKey = gameKey
        this.games[gameKey].addPlayer(socketID)
    }

    removeUserFromGame(gameKey, socketID) {
        this.games[gameKey].removePlayer(socketID)
    }
}



