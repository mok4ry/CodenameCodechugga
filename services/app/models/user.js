var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    challenges: [Number]
});

module.exports = mongoose.model('User', UserSchema);