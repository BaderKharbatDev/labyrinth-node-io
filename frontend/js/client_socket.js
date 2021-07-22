import Canvas from '/static/js/canvas.js'
import {colors, server_socket, client_socket} from '/static/js/constants.js'

const socket = io.connect();
let client_canvas = null

socket.on('connect', function(data) {
    console.log('Connected')
});

socket.on(client_socket.INIT_BOARD, function(data) {
    client_canvas = new Canvas(data.walls.length) 
})

socket.on(client_socket.UPDATE_BOARD, function(data) {
    if(!client_canvas) {
        client_canvas = new Canvas(data.walls.length) 
    }
    client_canvas.board.colorBG(colors.white) //bg
    client_canvas.board.paintObstacles(colors.red, data.walls) //walls
    client_canvas.board.paintPlayers(socket.id, data.players)
    socket.emit(server_socket.USER_GAME_INPUT, {keyinputs: client_canvas.keyinputs})
})

socket.on(client_socket.UPDATE_LOBBY, function(data){
    let ul = document.getElementById("lobby-player-list")
    ul.innerHTML = "";
    for (var key in data.players){
        let player = data.players[key]
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += player.name;   
    }
    document.getElementById('game-url').innerHTML = "localhost:3000/?g="+data.gameurl.toString()
})

socket.on(client_socket.SHOW_LOBBY, function(data) {
    if(data.is_leader == false) {
        document.getElementById("start-lobby").style.display = "none";
    }
    toggleLobbySection()
})

socket.on(client_socket.SHOW_GAME, function(data) {
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
            socket.emit(server_socket.JOIN_PRIVATE, {
                name: name,
                gameurl: g
            })
        } else {
            socket.emit(server_socket.JOIN_PUBLIC, {
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

