import {colors, units} from '/static/js/constants.js'
import Board from '/game_logic/board.js'

export default class canvas {
    constructor() {
        let canvas_id = 'canvas'
        let canvas_pixle_size = 600
        let board_length = 10
    
        this.board = new Board(canvas_id, canvas_pixle_size, board_length)
        this.board.colorBG(colors.white)
        this.board.colorGrid(colors.red)
    }
}

    



