var main = new Vue({
    el: '#main',
    data: {
        player_name: "",
        joining_screen: true,
        waiting_screen: false,
        question_screen: false,
        game_status: "",
        player_denied_join: false
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
        },
        socket_listeners: function() {
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
                if (status == "PLAYER_WAITING") {
                    main.player_denied_join = false;
                } else {
                    main.player_denied_join = true;
                }
                console.log(status);
                main.game_status = status;
            });
        },
    }
})