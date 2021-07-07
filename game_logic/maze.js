class Cell {
    constructor(row, col, collidable) {
        this.row = row
        this.col = col
        this.collidable = collidable
        this.checked = false
        this.isStart = false
    }
}

module.exports = class Maze {
    constructor(half_size) {
        this.half_size = half_size
        this.full_size = 2*half_size+1
        this.grid = new Array(this.full_size)
        for (var i = 0; i < this.full_size; i++) {
            this.grid[i] = new Array(this.full_size);
        }
    }

    getObstacleArray() {
        var rv = new Array(this.grid.length)
        for (var i = 0; i < rv.length; i++) {
            rv[i] = new Array(rv.length);
        }

        for(let row = 0; row < this.grid.length; row++) {
            for(let col = 0; col < this.grid.length; col++) {
                var cell = this.grid[row][col]
                if(cell.collidable == true) {
                    rv[row][col] = true
                } else {
                    rv[row][col] = false
                }
            }
        }
        return rv
    }

    initBlankMaze() {
        for(let row = 0; row < this.grid.length; row++) {
            for(let col = 0; col < this.grid.length; col++) {
                if(row%2 == 0 || col%2 == 0) {
                    this.grid[row][col] = new Cell(row, col, true)
                } else {
                    this.grid[row][col] = new Cell(row, col, false)
                }
            }
        }
        this.grid[1][1].isStart = true
    }

    generateMaze() {
        var startRow = 1, startCol = 1
        var endArray = []
        var stack = []
        var currentCell = this.grid[startRow][startCol]
        currentCell.checked = true


        let uncheckedCellCount = ((this.full_size-1)/2) ** 2
        while(uncheckedCellCount != 0) {
            if(this.getNumberOfNeighbors(currentCell) != 0) {
                let temp_cell = this.getRandomNeightborCell(currentCell)
                if(this.getNumberOfNeighbors(currentCell) > 1) {
                    stack.push(currentCell)
                }
                let wall = this.getWallBetweenCells(currentCell, temp_cell)
                wall.collidable = false

                currentCell = temp_cell
                currentCell.checked = true
                uncheckedCellCount--
            } else if(stack.length != 0) {
                endArray.push(currentCell)
                currentCell = self.getNextCellInStack(stack)
                if(currentCell == null) break
            }
        }
        if(endArray.length != 0) {
            endArray[Math.floor(endArray.length/2)]
        }
    }

    getNextCellInStack(stack) {
        var cell = stack.pop()
        if(this.getNumberOfNeighbors(cell) != 0){
            return cell
        } else {
            if(stack.length == 0) return null
            return this.getNextCellInStack(stack)
        }
    }

    getWallBetweenCells(a,b) {
        var aRow = a.row, aCol = a.col, bRow = b.row, bCol = b.col
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

    getRandomNeightborCell(c) {
        var cellRow = c.row, cellCol = c.col
        var neighborArray = []
        for(const horizontal of [-2,2]) {
            try {
                var cell = this.grid[cellRow][cellCol+horizontal] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    neighborArray.push(cell)
                }
            } catch(error) {
                //out of bounds
            }
        }
        for(const verticle of [-2,2]) {
            try {
                var cell = this.grid[cellRow+verticle][cellCol] //left right neighbors
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

    getNumberOfNeighbors(c) {
        var cellRow = c.row, cellCol = c.col
        var count = 0
        for(const horizontal of [-2,2]) {
            try {
                var cell = this.grid[cellRow][cellCol+horizontal] //left right neighbors
                if(!cell.isChecked && !cell.collidable) {
                    count++
                }
            } catch(error) {
                //out of bounds
            }
        }
        for(const verticle of [-2,2]) {
            try {
                var cell = this.grid[cellRow+verticle][cellCol] //up down neighbors
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
