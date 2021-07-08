import {colors, units} from '/static/js/constants.js'
import Board from '/static/js/board.js'

export default class canvas {
    constructor(board_length) {
        let canvas_id = 'canvas'
        let canvas_pixle_size = 800
    
        this.board = new Board(canvas_id, canvas_pixle_size, board_length)
        this.board.colorBG(colors.white)
    }

    
}

    



