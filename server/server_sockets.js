const Maze = require('../game_logic/maze.js')
var map = {}
const connections = []

module.exports = function(io) {

    io.on('connection', (socket) => {
        addUser(socket)
        socket.emit('board-state', map)

        socket.on('disconnect', ()=>{
            removeUser(socket.id)
        })
    });
}

function addUser(socket) {
    if(connections.length == 0) {
        let grid = makeMaze(10)
        map = {size: grid.length, obstacles: grid}
    }
    console.log('A user connected: '+socket.id);
    connections[socket.id] = socket
}

function removeUser(socket) {
    console.log('A user disconnected: '+socket.id)
    delete connections[socket.id]
}

function makeMaze(size) {
    let half_size = size
    let full_size = 2*half_size+1
    var m = new Maze(half_size)
    m.initBlankMaze()
    m.generateMaze()
    return m.getObstacleArray()
}