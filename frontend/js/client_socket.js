import Canvas from '/static/js/canvas.js'
var socket = io.connect();

let client_canvas = {}

socket.on('connect', function(data) {
    console.log('Connected')
    client_canvas = new Canvas(20) 
});