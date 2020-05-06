var controller = new Vue({
    el: '#main_control',
    data: {
        players: [],
        game_status: "NO_CONNECTION",
        current_question: {}
    },
    created() {
        this.socket_listeners();
        this.get_players();
        this.looping_function();
    },
    methods: {
        get_players: function() {
            socket.emit("controller_player_request");
        },
        looping_function: function() {
            setInterval(function() {
                controller.get_players();
            }, 1000);
        },
        socket_listeners: function() {
            // Updating player list
            socket.on("server_player_request", function(players) {
                console.log(players);
                controller.players = players;
            });
            // Updating the game status
            socket.on("server_game_status", function(status) {
                console.log(status);
                controller.game_status = status;
            });
            // Retrieve a question and display
            socket.on("server_question", function(question) {
                controller.current_question = question;
                console.log(question)
            });
        },
        search_for_players: function() {
            socket.emit("controller_search_for_players");
        },
        start_game: function() {
            socket.emit("controller_start_game_request");
        },
        end_game: function() {
            socket.emit("controller_end_game_request")
        },
        next_question: function() {
            //next question
            socket.emit("controller_previous_question_request")
        },
        previous_question: function() {
            //prev question
            socket.emit("controller_next_question_request")
        },
        reset_players: function() {
            socket.emit("controller_reset_players_request");
        },
        reveal_question_answer: function() {
            socket.emit("controller_question_answer_reveal");
        },
        question_submit: function() {
            // Submit question with name
        },
    }
})