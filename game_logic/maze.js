import {Tile} from './entity'

export default class maze {
    constructor(size) {
        this.size = size
        this.grid = [size][size]
    }

    getObstacleArray() {
        let rv = [this.size][this.size]
        for(let row = 0; row < this.size; row++) {
            for(let col = 0; col < this.size; col++) {
                obstacle = this.grid[row][col]
                if(obstacle != null && obstacle instanceof Tile && obstacle.collidable == true) {
                    rv[row][col] = True
                } else {
                    rv[row][col] = False
                }
            }
        }
    }

    initBlankMaze() {

    }

    generateMaze(startRow, startCol) {

    }

    getNextCellInStack(stack) {

    }

    getRandomNeightborCell(cellRow, cellCol) {

    }

    getNumberOfNeighbors(cellRow, cellCol) {
        
    }
}
