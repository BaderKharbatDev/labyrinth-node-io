const Game = require('../game_logic/game.js')
const {server_constants, client_constants} = require('./socket_constants')


module.exports = function(io) {

    io.getUniqueID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    };

    io.on('connection', function connection(socket) {
        socket.id = io.getUniqueID();
        console.log(socket.id)

        socket.on('message', function incoming(message) {
          console.log('received: %s', message);
        });
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



