// Require the node modules used 
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


let quiz_data = require('./QuizData.js');
var status = "PLAYER_WAITING";

var accepting_players = true;

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
    // Receive question response
    socket.on("client_question_response", function(username, response) {
        if (push_response_to_question(username, response)) {
            io.emit("server_question_response", username, true);
        } else {
            io.emit("server_question_response", username, false);
        }
    });

    // Reveal current question answer
    socket.on("controller_question_answer_reveal", function() {
        io.emit("server_reveal_answer", true);
    });

    // Reset The players
    socket.on("controller_reset_players_request", function() {
        quiz_data.players.length = 0;
    });

    socket.on("controller_next_question_request", function() {
        quiz_data.question_num--;
    });

    socket.on("controller_previous_question_request", function() {
        quiz_data.question_num++;
    });

    socket.on("controller_search_for_players", function() {
        // SEARCH FOR USERS
        status = "PLAYER_WAITING";
    });

    socket.on("controller_start_game_request", function() {
        // START THE GAME
        status = "PLAYING_GAME";
    });

    socket.on("controller_end_game_request", function() {
        // END THE CURRENT GAME
        status = "ENDING_GAME";
    });

    // Controller has requests players
    socket.on("controller_player_request", function() {
        io.emit("server_player_request", quiz_data.players);
    });

    if (accepting_players) {
        // Accepting Players
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

function push_response_to_question(username, response) {
    try {
        quiz_data.questions[quiz_data.question_num].question_responses.push({ player_name: username, player_response: response });
        return true;
    } catch (error) {
        return false;
    }
}

function send_current_question() {
    io.emit("server_question", quiz_data.questions[quiz_data.question_num]);
}

function send_current_game_status() {
    io.emit("server_game_status", status);
}

setInterval(function() {
    console.log(status);

    if (status == "PLAYING_WAITING") {
        // Waiting for players to join
        console.log("waiting for players.");
        accepting_players = true;

    } else if (status == "PLAYING_GAME") {
        // Game is started send questions
        console.log("emitting questions.");
        console.log("Emitting question: " + quiz_data.question_num)
        accepting_players = false;
        send_current_question();

    } else if (status == "ENDING_GAME") {
        // Game is ending send they to the end screen
        console.log("ending the game.");

    }

    send_current_game_status();

}, 1000);