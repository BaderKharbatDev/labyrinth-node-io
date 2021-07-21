const server_socket_constants = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_PUBLIC: 'player-join-global-game',
    JOIN_PRIVATE: 'player-join-private-game',
    START_PRIVATE: 'game-start',
    USER_GAME_INPUT: 'user-input-data'
}

const client_socket_constants = {
    SHOW_GAME: 'game-starting',
    SHOW_LOBBY: 'show-lobby',
    UPDATE_LOBBY: 'update-lobby',
    UPDATE_BOARD: 'update-board-state'
}

exports.server_constants = server_socket_constants
exports.client_constants = client_socket_constants