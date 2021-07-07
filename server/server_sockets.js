// import Maze from '/game_logic/maze.js'
const Maze = require('../game_logic/maze.js')

module.exports = function(io) {

    let half_size = 9
    let full_size = 2*half_size+1
    var m = new Maze(half_size)
    m.initBlankMaze()
    m.generateMaze()
    var obstacle_array = m.getObstacleArray()

    io.on('connection', (socket) => {
        console.log('a user connected: '+socket.id);

        socket.emit('board-state', {size:full_size, obstacles:obstacle_array})

        socket.on('disconnect', ()=>{
            console.log('a user disconnected: '+socket.id)
        })
    });
}