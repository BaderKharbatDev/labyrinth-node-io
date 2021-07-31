const Game = require('../game_logic/game.js')
const {server_constants, client_constants} = require('./socket_constants')


module.exports = function(io) {
    const manager = new Manager()

    io.on(server_constants.CONNECTION, (socket) => {

        console.log('connected')

        //connects and adds a user to game
        manager.connectUser(socket)

        //----------Handles when a user joins a global game
        socket.on(server_constants.JOIN_PUBLIC, (data)=> {
            let player_name = data.name
            connectUserToPublicGame(socket, player_name)            
        })

        //----------Handles when a user creates a private game
        socket.on(server_constants.JOIN_PRIVATE, (data)=> {
            let player_name = data.name
            let url = data.gameurl
            connectUsertoPrivateGame(socket, url, player_name)
        })

        //----------Handles the lobby leader starting the game
        socket.on(server_constants.START_PRIVATE, (data)=>{
            let player = manager.connections[socket.id]
            let gameKey = player.gameKey
            if(gameKey != null) {
                manager.startGame(gameKey)
                io.to(gameKey.toString()).emit(client_constants.SHOW_GAME, {})
            }
        })

        //----------Handles User Input during a game
        socket.on(server_constants.USER_GAME_INPUT, (data)=>{
            let player = manager.connections[socket.id]
            let gameKey = player.gameKey
            if(gameKey != null) {
                manager.games[gameKey].handleUserInputData(socket.id, data.keyinputs)
            }
        })

        socket.on(server_constants.DISCONNECT, ()=>{
            manager.disconnectUser(socket)
        })

        //-----------------------helper functions
        function connectUsertoPrivateGame(socket, url, player_name) {
            let gameKey
            if(url) {
                if(manager.games[url]) {
                    gameKey = url//adds user to private game
                } else {
                    connectUserToPublicGame(socket, player_name)// add user to public game
                    return
                }
            } else {
                gameKey = manager.createGame()
            }
  
            manager.addUserToGame(gameKey, socket.id, player_name)
            socket.join(gameKey.toString()) //adds user to game

            if(manager.games[gameKey].gameState == Game.gameStates.LOBBY) {
                let is_leader = (Object.keys(manager.games[gameKey].players).length == 1)
                io.to(socket.id).emit(client_constants.SHOW_LOBBY, {
                    is_leader: is_leader
                })
                io.to(gameKey.toString()).emit(client_constants.UPDATE_LOBBY, {
                    players: manager.games[gameKey].players,
                    gameurl: gameKey
                })
            } else {
                io.to(socket.id).emit(client_constants.SHOW_GAME, {})
            }
        }

        function connectUserToPublicGame(socket, player_name) {
            let gameKey
            if(Object.keys(manager.games).length == 0) { //no game in progress
                gameKey = manager.createGame()
                manager.startGame(gameKey)
            } else {
                let keyArray = Object.keys(manager.games)
                gameKey = manager.games[keyArray[0]].id
            }
            manager.addUserToGame(gameKey, socket.id, player_name)
            socket.join(gameKey.toString())
            io.to(socket.id).emit(client_constants.SHOW_GAME, {})
        }
    });
}

class Manager {
    static game_id_counter = 1

    constructor() {
        this.connections = {}
        this.games = {}
    }

    connectUser(socket) {
        var clientIp = socket.request.connection.remoteAddress;
        console.log('A user connected: '+clientIp);
        this.connections[socket.id] = socket
    }
    
    disconnectUser(socket) {
        var clientIp = socket.request.connection.remoteAddress;
        console.log('A user disconnected: '+clientIp);
        let playerGameID = this.connections[socket.id].gameKey
        if(playerGameID != null) {
            this.removeUserFromGame(playerGameID, socket.id) //removes player from game
            if(Object.keys(this.games[playerGameID].players).length == 0) {
                delete this.games[playerGameID]              //deletes game if empty
            }
        }
        delete this.connections[socket.id]                           //deletes socket from connections
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



