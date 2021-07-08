export default class board {
    constructor(canvas_id, board_pixle_size, board_length) {
        this.board_length = board_length
        this.block_size = board_pixle_size/board_length
        this.game_canvas = document.getElementById(canvas_id)
        this.ctx = this.game_canvas.getContext('2d')
        this.game_canvas.width = this.game_canvas.height = board_pixle_size            
    }

    colorBG(color) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(0,0,this.game_canvas.width, this.game_canvas.height)
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
    
    
}