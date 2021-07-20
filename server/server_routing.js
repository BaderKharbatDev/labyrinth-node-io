module.exports = function(app, express){
    app.use('/static', express.static('frontend'))
    app.use('/game_logic/', express.static('game_logic'))

    app.get('/', (req, res) => {
        var query = require('url').parse(req.url,true).query;
        let private_game = query.g
        
        res.sendFile('frontend/templates/game_page.html' , { root : './'});
    });

    // app.get('/:gamekey', (req, res) => {
    //     console.log(req.params.gamekey)
    //     res.sendFile('frontend/templates/game_page.html' , { root : './'});
    // });

    // app.get('/user/:id', function(req, res) {
    //     res.send('user' + req.params.id);    
    //   });
}