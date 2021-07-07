
class entity {
    constructor(name, collidable, texture) {
        this.collidable = collidable
        this.name = name
        this.texture = texture
    }
}

class Tile extends entity {
    constructor(name, isWall, texture) {
        super(name, isWall, texture)
    }
}

export {Tile as Tile}