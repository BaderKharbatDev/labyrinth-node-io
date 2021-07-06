module.exports = function(app, express){
    app.use('/static', express.static('frontend'))
    app.use('/game_logic/', express.static('game_logic'))
    app.get('/', (req, res) => {
        res.sendFile('frontend/templates/index.html' , { root : './'});
    });
}