var main = new Vue({
    el: '#main',
    data: {
        player_name: "",

        waiting_status: "PLAYER_WAITING",
        playing_status: "PLAYING_GAME",
        ending_status: "ENDING_GAME",

        joining_screen: true,
        waiting_screen: false,
        question_screen: false,
        ending_screen: false,

        game_status: "NO_CONNECTION",

        player_denied_join: false,
        question_response_failed: false,

        current_question: {},
        current_question_answer: ""
    },
    mounted() {
        this.socket_listeners();
    },
    methods: {
        join_server: function(player_name) {
            socket.emit("client_join_request", main.player_name);
        },
        reset_screen: function() {
            main.joining_screen = false;
            main.waiting_screen = false;
            main.question_screen = false;
            main.ending_screen = false;
        },
        question_submit: function() {
            // Send response to the server
            socket.emit("client_question_response", main.player_name, main.current_question_answer);
        },
        socket_listeners: function() {
            // Listener for the question success result 
            socket.on("server_question_response", function(username, response) {
                if (username == main.player_name) {
                    if (response) {
                        // Response received mute input
                        main.question_response_failed = true;
                    }
                }
            });
            // Listener for if the user has joined the game
            socket.on("server_join_request", function(status) {
                if (status == "SUCCESS") {
                    main.reset_screen();
                    main.waiting_screen = true;
                    console.log("successfully joined the game server.");
                }
            });
            // Updating the game status
            socket.on("server_game_status", function(status) {
                main.game_status = status;
                if (status == main.waiting_status) {
                    // Game is waiting for players
                    if (!main.waiting_screen) {
                        main.reset_screen();
                        main.joining_screen = true;
                    }
                } else if (status == main.playing_status) {
                    // Game is playing
                    main.reset_screen();
                    main.question_screen = true;
                } else if (status == main.ending_status) {
                    // Game is ending
                    main.reset_screen();
                    main.ending_screen = true;
                }
            });
            // Retrieve a question and display
            socket.on("server_question", function(question) {
                question.question_responses.length = 0;
                if (question.question_title != main.current_question.question_title) {
                    // Different question
                    main.current_question = question;
                    main.question_response_failed = false;
                } else {
                    // Same Question
                }
                console.log(question)
            });
        },
    }
})