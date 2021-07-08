
class entity {
    constructor(name, collidable, texture, row, col, size) {
        this.collidable = collidable
        this.name = name
        this.texture = texture
        this.row = row
        this.col = col
        this.size = size
    }
}

class Tile extends entity {
    constructor(name, isWall, texture, row, col, size) {
        super(name, isWall, texture, row, col, size)
    }
}

class Player extends entity {

    static playerStates = {
        IDLE: 1,
        RUNNING: 2
    }

    constructor(id, name, texture, row, col, size) {
        super(name, false, texture, row, col, size)
        this.id = id
        this.playerState = playerStates.IDLE
    }
}

export {Tile as Tile, Player as Player}