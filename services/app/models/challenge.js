var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
    name: String,
    text: String,
    answer: String,
    solved: Number,
    scores: [Number]
});

module.exports = mongoose.model('Challenge', ChallengeSchema);