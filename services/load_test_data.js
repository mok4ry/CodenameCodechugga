var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codechugga');

var Room = require('./app/models/room');
var User = require('./app/models/user');
var Challenge = require('./app/models/challenge');

Room.remove({}, function(err) { 
   console.log('Room collection removed');
});

User.remove({}, function(err) { 
   console.log('User collection removed');
});

Challenge.remove({}, function(err) { 
   console.log('Challenge collection removed');
});

var ballmer = new User();
ballmer.name = "Ballmer";
ballmer.score = 0;
ballmer.locked = false;
ballmer.save();

var challenge_1 = new Challenge();
challenge_1.name = "Sum of Numbers 1 to 100";
challenge_1.text = "Write a script to calculate the sum of the numbers 1 to 100.";
challenge_1.answer = 5050;
challenge_1.solved = 0;
challenge_1.scores = [];
challenge_1.save();

var challenge_2 = new Challenge();
challenge_2.name = "9!";
challenge_2.text = "Write a script to calculate the value of 9! (9 factorial).";
challenge_2.answer = 362880;
challenge_2.solved = 0;
challenge_2.scores = [];
challenge_2.save();

var room = new Room();
room.name = "Ballmer's Playground";
room.code = "1337h4x";
room.password = "ballmer";
room.owner = ballmer;
room.members = [ballmer];
room.connected = [];
room.challenges = [challenge_1, challenge_2];
room.activeChallenge = null;
room.running = false;
room.save();