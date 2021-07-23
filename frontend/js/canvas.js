import {colors, keys} from '/static/js/constants.js'
import Board from '/static/js/board.js'

export default class canvas {

    static c = {}

    constructor(board_length, map) {
        let canvas_id = 'canvas'
        var w = window.innerWidth*0.75;
        var h = window.innerHeight*0.75;
        let canvas_pixle_size
        if(w > h) {
            canvas_pixle_size = h
        } else {
            canvas_pixle_size = w
        }

        document.addEventListener('contextmenu', event => event.preventDefault());
        this.game_canvas = document.getElementById(canvas_id)
        this.ctx = this.game_canvas.getContext('2d')
        this.game_canvas.width = this.game_canvas.height = canvas_pixle_size 
    
        this.board = new Board(this.ctx, canvas_pixle_size, board_length, map)
        this.keyinputs = new KeyInputs()
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
        canvas.c = this
    }


    keydown(e) {
        if(e.keyCode == keys.a || e.keyCode == keys.left_arrow){
            canvas.c.keyinputs.left = true
        } else if(e.keyCode == keys.s || e.keyCode == keys.down_arrow) {
            canvas.c.keyinputs.down = true
        } else if(e.keyCode == keys.d || e.keyCode == keys.right_arrow) {
            canvas.c.keyinputs.right = true
        } else if(e.keyCode == keys.w || e.keyCode == keys.up_arrow) {
            canvas.c.keyinputs.up = true
        }
    }

    keyup(e) {
        if(e.keyCode == keys.a || e.keyCode == keys.left_arrow){
            canvas.c.keyinputs.left = false
        } else if(e.keyCode == keys.s || e.keyCode == keys.down_arrow) {
            canvas.c.keyinputs.down = false
        } else if(e.keyCode == keys.d || e.keyCode == keys.right_arrow) {
            canvas.c.keyinputs.right = false
        } else if(e.keyCode == keys.w || e.keyCode == keys.up_arrow) {
            canvas.c.keyinputs.up = false
        }
    }
}

class KeyInputs {
    constructor() {
        this.left = false
        this.right = false
        this.up = false
        this.down = false
    }
}



