// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var morgan     = require('morgan');

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

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/competitions')
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.username;
        user.challenges = [];
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
                user.challenges = [];
                user.save();

                room.members.push(user._id);
                room.save(function (err, r) {
                    res.send(200, {
                        userId : user._id,
                        roomId : r._id
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
            challenge.save(function (err, ch) {
                room.challenges.push(challenge);
                room.save();
                res.send(201, ch);
            });
        });
    });

router.route('/competitions/:comp_id/challenges/:challenge_id/start')
    .put(function (req, res) {
        Room.findById(req.params.comp_id, function (err, room) {
            Challenge.findById(req.params.challenge_id, function (err, challenge) {
                room.activeChallenge = challenge;
                room.running = true;
                room.save(function (err, r) {
                    room.connected.forEach(function (socketId) {
                        var censoredChallenge = {
                            name : challenge.name,
                            text : challenge.text
                        };
                        clients[socketId].emit('new-active-challenge', censoredChallenge);
                    });
                    res.send(200, challenge);
                });
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
            room.connected.push(socket.id);
            room.save();

            var response = {
                name : room.name,
                code : room.code,
                owner : room.owner,
                members : room.members,
                running : room.running,
                activeChallenge : room.activeChallenge
            };

            if (userId == room.owner._id) {
                console.log("CHALLENGES: " + room.challenges);
                response.challenges = room.challenges;
            }

            socket.emit('connected-to-challenge', response);
        });

    socket.on('disconnect', function () {
        delete clients[socket.id];
        Room.findById(roomId, function(err, room) {
            var index = room.connected.indexOf(socket.id);
            if (index > -1) room.connected.splice(index, 1);
            room.save();
        });
    });

    // socket.on('new-chat-message', function (info) {

    // });
});
