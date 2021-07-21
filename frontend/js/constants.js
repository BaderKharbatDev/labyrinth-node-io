const colors = {
    black: '#000000',
    white: '#ffffff',
    red: '#FF0000',
    blue: '#33ACFF',
    yellow: '#8DFF33'
}

const keys = {
    a: 65,
    w: 87,
    s: 83,
    d: 68,
    left_arrow: 37,
    right_arrow: 39,
    up_arrow: 38,
    down_arrow: 40
}

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

export { colors as colors, keys as keys, client_socket_constants as client_socket, server_socket_constants as server_socket}