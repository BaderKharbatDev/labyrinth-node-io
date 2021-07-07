import {Tile} from './entity'

class cell {
    constructor(row, col, collidable) {
        this.row = row
        this.col = col
        this.collidable = collidable
        this.checked = false
        this.isStart = false
    }
}

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
        for(let row = 0; row < this.size; row++) {
            for(let col = 0; col < this.size; col++) {
                if(row%2 == 0 || col%2 == 0) {
                    self.grid[row][col] = new cell(row, col, true)
                } else {
                    self.grid[row][col] = new cell(row, col, false)
                }
            }
        }
        this.grid[1][1].isStart = true
    }

    generateMaze(startRow, startCol) {
        endArray = []
        stack = []
        currentCell = this.grid[startRow][startCol]
        
    }

    getNextCellInStack(stack) {
        cell = stack.pop()
        if(this.getNumberOfNeighbors(cell.row, cell.col) != 0){
            return cell
        } else {
            if(stack.length == 0) return null
            return this.getNextCellInStack(stack)
        }
    }

    getWallBetweenCells(aRow,aCol,bRow,bCol) {
        if(aRow == bRow) {
            if(aCol<bCol) {
                return this.grid[aRow][aCol+1]
            } else {
                return this.grid[aRow][aCol-1]
            }
        } else {
            if(aRow<bRow) {
                return this.grid[aRow+1][aCol]
            } else {
                return this.grid[aRow-1][aCol]
            }
        }
    }

    getRandomNeightborCell(cellRow, cellCol) {
        neighborArray = []
        for(const horizontal in [-2,2]) {
            try {
                cell = this.grid[cellRow][cellCol+horizontal] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    neighborArray.push(cell)
                }
            } catch(error) {
                //out of bounds
            }
        }
        for(const verticle in [-2,2]) {
            try {
                cell = this.grid[cellRow+verticle][cellCol] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    neighborArray.push(cell)
                }
            } catch(error) {
                //out of bounds
            }
        }
        let rInd = Math.floor(Math.random() * neighborArray.length);
        return neighborArray[rInd]
    }

    getNumberOfNeighbors(cellRow, cellCol) {
        let count = 0
        for(const horizontal in [-2,2]) {
            try {
                cell = this.grid[cellRow][cellCol+horizontal] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    count++
                }
            } catch(error) {
                //out of bounds
            }
        }
        for(const verticle in [-2,2]) {
            try {
                cell = this.grid[cellRow+verticle][cellCol] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    count++
                }
            } catch(error) {
                //out of bounds
            }
        }
        return count
    }
}
