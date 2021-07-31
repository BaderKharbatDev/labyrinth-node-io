import { client_constants } from '../../server/socket_constants'
import Canvas from '/static/js/canvas.js'
import {colors, server_socket, client_socket} from '/static/js/constants.js'

let client_canvas = null

const server_socket_constants = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_PUBLIC: 'player-join-global-game',
    JOIN_PRIVATE: 'player-join-private-game',
    START_PRIVATE: 'game-start',
    USER_GAME_INPUT: 'user-input-data'
}

const client_socket_constants = {
    SHOW_GAME: 'game-starting',
    SHOW_LOBBY: 'show-lobby',
    UPDATE_LOBBY: 'update-lobby',
    UPDATE_BOARD: 'update-board-state',
    INIT_BOARD: 'init-board-state'
}

// Create WebSocket connection.
const soc = new WebSocket('ws://localhost:8080');

// Connection opened
soc.addEventListener('open', function (event) {
    console.log('Connected')
});

// Listen for messages
soc.addEventListener('message', function (e) {
    let packet = JSON.parse(e.data);
    switch(packet.cmd) {
        case client_constants.CONNECTION:
            soc.id = packet.id
            break;
        case client_constants.INIT_BOARD:
            client_canvas = new Canvas(packet.map.length, packet.map) 
            break;
        case client_constants.UPDATE_BOARD:
            client_canvas.board.colorBG(colors.white) //bg
            client_canvas.board.paintObstacles(colors.red) //walls
            client_canvas.board.paintPlayers(soc.id, packet.players)
            // socket.emit(server_socket.USER_GAME_INPUT, {keyinputs: client_canvas.keyinputs})
            let packet = {
                cmd: server_socket.USER_GAME_INPUT,
                keyinputs: client_canvas.keyinputs
            }
            soc.send(JSON.stringify(packet))
            break;
        case client_constants.UPDATE_LOBBY:
            let ul = document.getElementById("lobby-player-list")
            ul.innerHTML = "";
            for (var key in data.players){
                let player = data.players[key]
                let li = document.createElement('li');
                ul.appendChild(li);
                li.innerHTML += player.name;   
            }
            var getUrl = window.location;
            var baseUrl = getUrl .protocol + "//" + getUrl.host   
            document.getElementById('game-url').innerHTML = baseUrl+"/?g="+data.gameurl.toString()
            break;
        case client_constants.SHOW_LOBBY:
            if(data.is_leader == false) {
                document.getElementById("start-lobby").style.display = "none";
                document.getElementById("gamemode-div").style.display = "none";
            }
            toggleLobbySection()
            break;
        case client_constants.SHOW_GAME:
            toggleCanvasSection()
            break;
    }
});

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
            let packet = {
                cmd: client_constants.JOIN_PRIVATE,
                name: name,
                gameurl: g
            }
            soc.send(JSON.stringify(packet))
        } else {
            let packet = {
                cmd: client_constants.JOIN_PUBLIC,
            }
            soc.send(JSON.stringify(packet))
        }
    } else {
        alert('Name Field Cannot Be Empty :)')
    }
}

function playPrivate() {
    let name = document.getElementById("player_name").value;
    if(name && name.length >=1) {
        let packet = {
            cmd: client_constants.JOIN_PRIVATE,
            name: name
        }
        soc.send(JSON.stringify(packet))
        toggleLobbySection()
    } else {
        alert('Name Field Cannot Be Empty :)')
    }
}

function startPrivateGame() {
    let packet = {
        cmd: client_constants.START_PRIVATE,
    }
    soc.send(JSON.stringify(packet))
}

document.getElementById("play_button").onclick = play;
document.getElementById("create_private_button").onclick = playPrivate;
document.getElementById("start-lobby").onclick = startPrivateGame;