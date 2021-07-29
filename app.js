var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 80

var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

// import routes
require('./server/server_routing')(app, express)
// import socket functions
require('./server/server_sockets')(io)

server.listen(port);
console.log('Started on '+port)

