import Canvas from '/static/js/canvas.js'
import {colors, server_socket, client_socket} from '/static/js/constants.js'

// Create WebSocket connection.
const soc = new WebSocket('ws://localhost:8080');

// Connection opened
soc.addEventListener('open', function (event) {
    console.log('Connected using ws')
    soc.send('Hello Server!');
});

// Listen for messages
soc.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});