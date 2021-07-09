const Players = require('entity.js').Player

export default class Game {
    static gameStates = {
        LOBBY: 0,
        INGAME: 1,
        FINISHED: 2
    }

    constructor() {
        this.id
        this.players = {}
        this.gameState = gameStates.WAITING

        this.grid_size
        this.walls   
    }
    
}