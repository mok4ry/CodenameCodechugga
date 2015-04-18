var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    name: String,
    code: String,
    password: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    connected: [String],
    challenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    activeChallenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
    running: Boolean
});

module.exports = mongoose.model('Room', RoomSchema);