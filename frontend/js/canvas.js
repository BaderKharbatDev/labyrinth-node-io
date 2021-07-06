import {colors, units} from '/static/js/constants.js'
import Board from '/game_logic/board.js'

let canvas_id = 'canvas'
let canvas_pixle_size = 600
let board_length = 10

let board = new Board(canvas_id, canvas_pixle_size, board_length)
board.colorBG(colors.white)
board.colorGrid(colors.red)


