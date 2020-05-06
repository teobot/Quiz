const questions = [{
        question_title: "What's my name?",
        question_answer: "theo",
        question_responses: [{
            player_name: "Theo",
            player_response: "theo"
        }]
    },
    {
        question_title: "What's the dog called?",
        question_answer: "nessa",
        question_responses: []
    }
];

const players = [{
    player_name: "Theo",
    player_score: 0
}]

const question_num = 0;

module.exports.players = players;
module.exports.question_num = question_num;
module.exports.questions = questions;