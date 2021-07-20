import Canvas from '/static/js/canvas.js'
import {colors, server_socket, client_socket} from '/static/js/constants.js'

const socket = io.connect();
let client_canvas = null

socket.on('connect', function(data) {
    console.log('Connected')
});

socket.on('update-board-state', function(data) {
    if(!client_canvas) {
        client_canvas = new Canvas(data.walls.length) 
    }
    client_canvas.board.colorBG(colors.white) //bg
    client_canvas.board.paintObstacles(colors.red, data.walls) //walls
    client_canvas.board.paintPlayers(socket.id, data.players)
    socket.emit('user-input-data', {keyinputs: client_canvas.keyinputs})
})

socket.on('update-lobby', function(data){
    let ul = document.getElementById("lobby-player-list")
    ul.innerHTML = "";
    for (var key in data.players){
        let player = data.players[key]
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += player.name;   
    }
    document.getElementById('game-url').innerHTML = "Share The Link With Friends: localhost:3000/?g="+data.gameurl.toString()
})

socket.on('joined-lobby', function(data) {
    toggleLobbySection()
})

socket.on('game-starting', function(data) {
    toggleCanvasSection()
})

//-------------webpage control, replace later
var x = document.getElementById("canvas-section");
var y = document.getElementById("login-form-section");
var z = document.getElementById('lobby-section');
x.style.display = "none"
z.style.display = "none"

function toggleCanvasSection() {
    y.style.display = "none"
    z.style.display = "none"
    x.style.display = "block"
}

function toggleLobbySection() {
    y.style.display = "none"
    z.style.display = "block"
    x.style.display = "none"
} 

//on click of the "PLAY" button
function play() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let g = params.g
    let name = document.getElementById("player_name").value;

    if(name && name.length >=1) {
        if(g) {
            socket.emit('player-join-private-game', {
                name: name,
                gameurl: g
            })
        } else {
            socket.emit('player-join-global-game', {
                name: name
            })
        }
    }
}

function playPrivate() {
    let name = document.getElementById("player_name").value;
    if(name && name.length >=1) {
        socket.emit('player-join-private-game', {
            name: name
        })
        toggleLobbySection()
    }
}

function startPrivateGame() {
    socket.emit('game-start', {})
}

document.getElementById("play_button").onclick = play;
document.getElementById("create_private_button").onclick = playPrivate;
document.getElementById("start-lobby").onclick = startPrivateGame;

