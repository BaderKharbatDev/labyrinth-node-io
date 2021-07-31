var express = require('express');
var app = express();
var server = require('http').createServer(app);
const ws = require('ws');
var port = 80

const io = new ws.Server({ noServer: true })

// var io = require('socket.io')(server);
// var redis = require('socket.io-redis');
// io.adapter(redis({ host: 'localhost', port: 6379 }));

// import routes
require('./server/server_routing')(app, express)
// import socket functions
require('./server/refactored_server_sockets')(io)

server.listen(port);
server.on('upgrade', (request, socket, head) => {
    io.handleUpgrade(request, socket, head, socket => {
        io.emit('connection', socket, request);
    });
});

console.log('Started on '+port)

