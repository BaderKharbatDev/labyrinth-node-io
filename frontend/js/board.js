import {colors} from '/static/js/constants.js'

export default class board {
    constructor(ctx, board_pixle_size, board_length) {
        this.board_length = board_length
        this.block_size = board_pixle_size/board_length
        this.ctx = ctx    
    }

    colorBG(color) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(0,0,this.block_size*this.board_length, this.block_size*this.board_length)
    }

    colorGrid(color) {
        this.ctx.fillStyle = color
        for(let row = 0; row < this.board_length; row++) {
            for(let col = 0; col < this.board_length; col++) {
                this.ctx.fillRect(col*this.block_size, row*this.block_size, this.block_size-1, this.block_size-1)
            }
        }
    }

    paintObstacles(color, grid) {
        this.ctx.fillStyle = color
        for(let row = 0; row < grid.length; row++) {
            for(let col = 0; col < grid[row].length; col++) {
                if(grid[row][col] == true) {
                    this.ctx.fillRect(col*this.block_size-1, row*this.block_size-1, this.block_size+1, this.block_size+1)
                }
            }
        }
    }

    paintPlayers(socketID, players) {
        for(var key in players) {
            if(key == socketID) {
                this.ctx.fillStyle = colors.blue
            } else {
                this.ctx.fillStyle = color.yellow
            }
            let p = players[key]
            this.ctx.fillRect(p.col*this.block_size-1, p.row*this.block_size-1, this.block_size/2+1, this.block_size/2+1)
        }
    }
    
    
}