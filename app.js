var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000

// import routes
require('./server/server_routing')(app, express)
// import socket functions
require('./server/server_sockets')(io)

server.listen(port);
