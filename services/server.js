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

router.route('/login')
    .post(function (req, res) {

    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
http.listen(port, function () {
    console.log('Magic happens on port ' + port);
});

var clients = {};

io.on('connection', function(socket){
    clients[socket.id] = socket;

    // var userName = socket.handshake.query.name;

    // socket.on('disconnect', function () {
        
    // });

    // socket.on('new-chat-message', function (info) {

    // });
});
