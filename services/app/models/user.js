var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    score: Number
});

module.exports = mongoose.model('User', UserSchema);