var controller = new Vue({
    el: '#main_control',
    data: {
        players: [],
        game_status: ""
    },
    created() {
        this.socket_listeners();
        this.get_players();
    },
    methods: {
        get_players: function() {
            socket.emit("controller_player_request");
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
        },
        search_for_players: function() {
            socket.emit("controller_search_for_players");
        },
        start_game: function() {
            socket.emit("controller_start_game_request");
        },
        end_game: function() {
            socket.emit("controller_end_game_request")
        }
    }
})


// setInterval( function(){
// },750);