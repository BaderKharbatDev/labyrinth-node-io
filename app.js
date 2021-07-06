var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000


app.use('/static', express.static('frontend'))
app.use('/game_logic/', express.static('game_logic'))
app.get('/', (req, res) => {
    res.sendFile('frontend/templates/index.html' , { root : __dirname});
});

io.on('connection', (socket) => {
  console.log('a user connected: '+socket.id);
  socket.on('disconnect', ()=>{
      console.log('a user disconnected: '+socket.id)
  })
});

server.listen(port);
