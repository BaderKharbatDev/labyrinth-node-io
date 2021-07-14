import Canvas from '/static/js/canvas.js'
import {colors, units} from '/static/js/constants.js'

var socket = io.connect();

let client_canvas = {}

socket.on('connect', function(data) {
    console.log('Connected')
});

socket.on('init-board-state', function(data) {
    console.log('Received Board State')
    client_canvas = new Canvas(data.walls.length) 
    client_canvas.board.paintObstacles(colors.red, data.walls)
});