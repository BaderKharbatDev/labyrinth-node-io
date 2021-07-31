const Game = require('../game_logic/game.js')

const socket_constants = {
    CONNECTION: 'connection',
    DISCONNECT: 'close',
    INIT_CLIENT: 'init-client',
    CLIENT_MESSAGE: 'message',
    JOIN_PUBLIC: 'player-join-global-game',
    JOIN_PRIVATE: 'player-join-private-game',
    START_PRIVATE: 'game-start',
    USER_GAME_INPUT: 'user-input-data'
}

const client_constants = {
    SHOW_GAME: 'game-starting',
    SHOW_LOBBY: 'show-lobby',
    UPDATE_LOBBY: 'update-lobby',
    UPDATE_BOARD: 'update-board-state',
    INIT_BOARD: 'init-board-state'
}

module.exports = function(io) {
    const manager = new Manager()

    io.on(socket_constants.CONNECTION, function connection(socket) {
        socket.id = io.getUniqueID();
        console.log('Client Connected id: '+socket.id)

        let packet = {
            cmd: socket_constants.INIT_CLIENT,
            id: socket.id
        }
        socket.send(JSON.stringify(packet))

        manager.connectUser(socket)

        socket.on(socket_constants.CLIENT_MESSAGE, function incoming(e) {
            var packet = JSON.parse(e)
            // console.log(packet.cmd)
            let cmd = packet.cmd
            if(cmd == socket_constants.JOIN_PUBLIC){
                let player_name = packet.name
                io.connectUserToPublicGame(socket, player_name) 
            } else if(cmd == socket_constants.JOIN_PRIVATE) {
                let player_name = packet.name
                let url = packet.gameurl
                connectUsertoPrivateGame(socket, url, player_name)
            } else if(cmd == socket_constants.START_PRIVATE) {
                let player = manager.connections[socket.id]
                let gameKey = player.gameKey
                if(gameKey != null) {
                    manager.startGame(gameKey)
                    let n_packet = {
                        cmd: client_constants.SHOW_GAME
                    }
                    let game_client_list = manager.games[gameKey].clients
                    for (var id in game_client_list){
                        game_client_list[id].send(JSON.stringify(n_packet))
                    }
                }
            } else if(cmd == socket_constants.USER_GAME_INPUT) {
                let player = manager.connections[socket.id]
                let gameKey = player.gameKey
                if(gameKey != null) {
                    manager.games[gameKey].handleUserInputData(packet.id, packet.keyinputs)
                }
            } 
        });

        socket.on(socket_constants.DISCONNECT, function close() {
            manager.disconnectUser(socket.id)
        });
    });

    
        //-----------------------helper functions
        io.getUniqueID = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4();
        };

        io.connectUsertoPrivateGame = function(socket, url, player_name) {
            let gameKey
            if(url) {
                if(manager.games[url]) {
                    gameKey = url//adds user to private game
                } else {
                    manager.connectUserToPublicGame(socket, player_name)// add user to public game
                    return
                }
            } else {
                gameKey = manager.createGame()
            }
    
            manager.addUserToGame(gameKey, socket, player_name)

            if(manager.games[gameKey].gameState == Game.gameStates.LOBBY) {
                let is_leader = (Object.keys(manager.games[gameKey].players).length == 1)

                //SEND CLIENT A MESSAGE TO SHOW THE LOBBY SCREEN
                let packet = {
                    cmd: client_constants.SHOW_LOBBY,
                    is_leader: is_leader
                }
                socket.send(JSON.stringify(packet))

                //SEND UPDATE LOBBY SOCKET TO PLAYERS IN LOBBY
                packet = {
                    cmd: client_constants.UPDATE_LOBBY,
                    gameurl: gameKey,
                    players: manager.games[gameKey].players
                }
                let game_client_list = manager.games[gameKey].clients
                for (var id in game_client_list){
                    game_client_list[id].send(JSON.stringify(packet))
                }

            } else {
                //SEND SHOWGAE SOCKET TO PLAYERS IN LOBBY
                let packet = {
                    cmd: client_constants.SHOW_GAME
                }
                socket.send(JSON.stringify(packet))
            }
        }

        io.connectUserToPublicGame = function(socket, player_name) {
            let gameKey
            if(Object.keys(manager.games).length == 0) { //no game in progress
                gameKey = manager.createGame()
                manager.startGame(gameKey)
            } else {
                let keyArray = Object.keys(manager.games)
                gameKey = manager.games[keyArray[0]].id
            }
            manager.addUserToGame(gameKey, socket, player_name)

            let packet = {
                cmd: client_constants.SHOW_GAME
            }
            socket.send(JSON.stringify(packet))
        }
}

class Manager {
    static game_id_counter = 1

    constructor() {
        this.connections = {}
        this.games = {}
    }

    connectUser(socket) {
        // var clientIp = socket.request.connection.remoteAddress;
        // console.log('A user connected: '+clientIp);
        this.connections[socket.id] = socket
    }
    
    disconnectUser(socketID) {
        // var clientIp = socket.request.connection.remoteAddress;
        // console.log('A user disconnected: '+clientIp);
        let playerGameID = this.connections[socketID].gameKey
        if(playerGameID != null) {
            this.removeUserFromGame(playerGameID, socketID) //removes player from game
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

    addUserToGame(gameKey, socket, player_name) {
        this.connections[socket.id].gameKey = gameKey
        this.games[gameKey].addPlayer(socket, player_name)
    }

    removeUserFromGame(gameKey, socketID) {
        this.games[gameKey].removePlayer(socketID)
    }
}




