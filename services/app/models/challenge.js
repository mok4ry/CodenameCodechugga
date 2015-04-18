var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
    name: String,
    text: String,
    answer: String
});

module.exports = mongoose.model('Challenge', ChallengeSchema);