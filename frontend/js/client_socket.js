import Canvas from '/static/js/canvas.js'
import {colors, units} from '/static/js/constants.js'

const socket = io.connect();
let client_canvas = {}

socket.on('connect', function(data) {
    console.log('Connected')
});

socket.on('init-board-state', function(data) {
    console.log('Received Board State')
    client_canvas = new Canvas(data.walls.length) 
    client_canvas.board.paintObstacles(colors.red, data.walls)
});

socket.on('update-board-state', function(data) {
    client_canvas.board.colorBG(colors.white) //bg
    client_canvas.board.paintObstacles(colors.red, data.walls) //walls
    client_canvas.board.paintPlayers(socket.id, data.players)
    socket.emit('user-input-data', {keyinputs: client_canvas.keyinputs})
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
function joinGlobalGame() {
    let name = document.getElementById("player_name").value;
    if(name && name.length >=1) {
        socket.emit('player-join-global-game', {
            name: name
        })
        toggleCanvasSection()
    }
}

function joinPrivateGame() {
    let name = document.getElementById("player_name").value;
    if(name && name.length >=1) {
        socket.emit('player-join-private-game', {
            name: name
        })
        toggleLobbySection()
    }
}

document.getElementById("join_global_button").onclick = joinGlobalGame;
document.getElementById("join_private_button").onclick = joinPrivateGame;

