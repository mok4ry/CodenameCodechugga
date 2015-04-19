// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var morgan     = require('morgan');
var vm = require('vm');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codechugga'); // connect to our database

var Room = require('./app/models/room');
var User = require('./app/models/user');
var Challenge = require('./app/models/challenge');

// keeping track of connected client sockets
var clients = {};

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var getScoreStructure = function (numContestants) {
    var payouts = [100, 80, 60, 40, 30, 20, 15, 10, 5]
    var spotsPaid = Math.ceil(numContestants / 3) + 1;
    var scores = [];
    for (var i = 0; i < spotsPaid && i < payouts.length; i++) {
        scores.push(payouts[i]);
    }
    return scores;
};

router.use(allowCrossDomain);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/competitions')
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.username;
        user.score = 0;
        user.save();

        var room = new Room();
        room.name = req.body.roomName;
        room.code = room._id.toString().substring(7, 13);
        room.password = req.body.roomPassword;
        room.owner = user._id;
        room.members = [user._id];
        room.connected = [];
        room.challenges = [];
        room.running = false;
        room.save(function (err, room) {
            Room.populate(room, {
                path : 'owner',
                model : 'User',
                select : '-challenges'
            }, function (error, r) {
                res.send(201, r);
            });
        });
    });

router.route('/competitions/:comp_code')
    .put(function (req, res) {
        Room.find({ code : req.params.comp_code }, function (err, rooms) {
            if (rooms.length === 0) {
                res.send(404, { error : "Competition " + req.params.comp_code + " not found" });
            } else if (req.body.password !== rooms[0].password) {
                res.send(401, { error : "Invalid password for competition " + req.params.comp_code });
            } else {
                var room = rooms[0];

                var user = new User();
                user.name = req.body.username;
                user.score = 0;
                user.save();

                room.members.push(user._id);
                room.save();

                Room.populate(room, {
                    path : 'owner',
                    model : 'User'
                }, function (err, r) {
                    res.send(200, {
                        userId : user._id,
                        roomId : r._id,
                        owner : r.owner
                    });
                });
            }
        });
    });

router.route('/competitions/:comp_id/challenges')
    .post(function (req, res) {
        Room.findById(req.params.comp_id, function (err, room) {
            var challenge = new Challenge();
            challenge.name = req.body.name;
            challenge.text = req.body.text;
            challenge.answer = req.body.answer;
            challenge.scores = [];
            challenge.solved = 0;
            challenge.save(function (err, ch) {
                room.challenges.push(challenge);
                room.save();
                res.send(201, ch);
            });
        });
    });

router.route('/competitions/:comp_id/challenges/:challenge_id')
    .put(function (req, res) {
        var updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.text) updates.text = req.body.text;
        if (req.body.answer) updates.answer = req.body.answer;

        Challenge.update({
            _id : req.params.challenge_id
        }, updates, function (err, numAffected) {
            Room.findById(req.params.comp_id, function (err, room) {
                if (room.activeChallenge == req.params.challenge_id) {
                    console.log("Active challenge updated!");
                    room.connected.forEach(function (socketId) {
                        if (clients[socketId]) clients[socketId].emit('active-challenge-updated', updates);
                    });
                }
            });
            res.send(200);
        });
    });

router.route('/competitions/:comp_id/challenges/:challenge_id/start')
    .put(function (req, res) {
        Room.findById(req.params.comp_id, function (err, room) {
            Challenge.findById(req.params.challenge_id, function (err, challenge) {
                var contestants = room.connected.length - 1; // - 1 for moderator
                challenge.scores = getScoreStructure(contestants);
                challenge.save();

                room.activeChallenge = challenge;
                room.running = true;
                room.save(function (err, r) {
                    room.connected.forEach(function (socketId) {
                        var censoredChallenge = {
                            _id : challenge._id,
                            name : challenge.name,
                            text : challenge.text
                        };
                        if (clients[socketId])
                            clients[socketId].emit('new-active-challenge', censoredChallenge);
                    });
                    res.send(200, challenge);
                });
            });
        });
    });

router.route('/competitions/:comp_id/challenges/:challenge_id/submit')
    .post(function (req, res) {
        Room.findById(req.params.comp_id, function (err, room) {
            Challenge.findById(req.params.challenge_id, function (err, challenge) {
                var sandbox = { answer : null };
                vm.createContext(sandbox);
                try {
                    vm.runInContext(req.body.code, sandbox, { timeout : 2000 });
                    if (sandbox.answer == challenge.answer) {
                        User.findById(req.body.userId, function (err, user) {
                            var points = challenge.scores[challenge.solved];
                            console.log("Points: " + points);
                            var updatedScore = user.score + points;
                            user.score = updatedScore;
                            user.save();

                            challenge.solved += 1;
                            challenge.save();

                            room.connected.forEach(function (socketId) {
                                if (clients[socketId]) {
                                    clients[socketId].emit('correct-answer-submitted', {
                                        userId : req.body.userId,
                                        score : updatedScore,
                                        challengeId : req.params.challenge_id
                                    });
                                    if (challenge.solved === challenge.scores.length) {
                                        clients[socketId].emit('challenge-over', {
                                            challengeId : req.params.challenge_id
                                        });
                                    }
                                }
                            });
                        });
                    } else {
                        room.connected.forEach(function (socketId) {
                            if (clients[socketId])
                                clients[socketId].emit('incorrect-answer-submitted', {
                                    userId : req.body.userId,
                                    challengeId : req.params.challenge_id
                                });
                        });
                    }
                } catch (e) {
                    console.log(room.connected);
                    console.log(clients);
                    room.connected.forEach(function (socketId) {
                        if (clients[socketId])
                            clients[socketId].emit('incorrect-answer-submitted', {
                                userId : req.body.userId,
                                challengeId : req.params.challenge_id
                            });
                    });
                }
                res.send(200);
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
http.listen(port, function () {
    console.log('Magic happens on port ' + port);
});

io.set('origins', 'http://localhost:8000');

io.on('connection', function(socket){
    clients[socket.id] = socket;

    var userId = socket.handshake.query.userId;
    var roomId = socket.handshake.query.roomId;

    console.log("User " + userId + " connected in competition " + roomId);

    Room.findById(roomId)
        .populate('owner members challenges activeChallenge')
        .exec(function(err, room) {
            User.findById(userId, function (err, user) {
                room.connected.forEach(function (socketId) {
                    if (clients[socketId])
                        clients[socketId].emit('user-connected', user);
                });
                room.connected.push(socket.id);
                room.save();
            });

            var response = {
                name : room.name,
                code : room.code,
                owner : room.owner,
                members : room.members,
                running : room.running,
                activeChallenge : room.activeChallenge
            };

            if (userId == room.owner._id) {
                response.challenges = room.challenges;
            }

            socket.emit('connected-to-competition', response);
        });

    socket.on('disconnect', function () {
        delete clients[socket.id];
        Room.findById(roomId, function(err, room) {
            var index = room.connected.indexOf(socket.id);
            if (index > -1) room.connected.splice(index, 1);
            room.save(function (err, r) {
                r.connected.forEach(function (socketId) {
                    if (clients[socketId])
                        clients[socketId].emit('user-disconnected', {
                            userId : userId
                        });
                });
            });
        });
    });

    // socket.on('new-chat-message', function (info) {

    // });
});
