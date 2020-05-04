// Require the node modules used 
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


let quiz_data = require('./QuizData.js');
var status = "PLAYER_WAITING";


function handler(req, res) {
    //Change the servers index.html response code to 200 meaning that the server has been created correctly
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}

app.listen(8080, function(response) {
    console.log("Server started! listening on localhost:8080");
});


io.on("connection", function(socket) {

    setInterval(function() {
        io.emit("server_game_status", status);
    }, 1000);

    socket.on("controller_search_for_players", function() {
        // SEARCH FOR USERS
        status = "PLAYER_WAITING"
    });

    socket.on("controller_start_game_request", function() {
        // START THE GAME
        status = "PLAYING_GAME"
    });

    socket.on("controller_end_game_request", function() {
        // END THE CURRENT GAME
        status = "ENDING_GAME"
    });

    // Controller has requests players
    socket.on("controller_player_request", function() {
        io.emit("server_player_request", quiz_data.players);
    });

    // If the game status is waiting for users then let users join
    if (status == "PLAYER_WAITING") {
        socket.on("client_join_request", function(username) {
            try {
                quiz_data.players.push({ player_name: username, player_score: 0 });
                console.log(quiz_data.players);
                io.emit("server_join_request", "SUCCESS");
                io.emit("server_player_request", quiz_data.players);
            } catch (err) {
                io.emit("server_join_request", "FAILED");
            }
        });
    }

});