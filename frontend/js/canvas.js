import {colors, units} from '/static/js/constants.js'
import Board from '/static/js/board.js'

export default class canvas {
    constructor(board_length) {
        let canvas_id = 'canvas'
        let canvas_pixle_size = 800

        this.game_canvas = document.getElementById(canvas_id)
        this.ctx = this.game_canvas.getContext('2d')
        this.game_canvas.width = this.game_canvas.height = board_pixle_size 
    
        this.board = new Board(this.ctx, canvas_pixle_size, board_length)
        this.board.colorBG(colors.white)
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }


    keydown(e) {
        if(e.keyCode == A_KEY){
            game.singleton.player.keys.a = true
        } else if(e.keyCode == S_KEY) {
            game.singleton.player.keys.s = true
        } else if(e.keyCode == D_KEY) {
            game.singleton.player.keys.d = true
        } else if(e.keyCode == W_KEY) {
            game.singleton.player.keys.w = true
        }
    }

    keyup(e) {
        if(e.keyCode == A_KEY){
            game.singleton.player.keys.a = false
        } else if(e.keyCode == S_KEY) {
            game.singleton.player.keys.s = false
        } else if(e.keyCode == D_KEY) {
            game.singleton.player.keys.d = false
        } else if(e.keyCode == W_KEY) {
            game.singleton.player.keys.w = false
        }
    }

    
}

    



