questionApp.service("modService", function() {
    var modInfo = {
        roomCode: "",
        roomName: "",
        roomId: "",
        roomPassword: "",
        userId: "",
        username: "",
        isOwner: false
    };
    
    return {
        info:function() {
            return modInfo;
        },
        setRoomCode: function(roomCode) {
            modInfo.roomCode = roomCode;
        },
        getRoomCode: function() {
            return modInfo.roomCode;
        },
        setRoomId: function(roomId) {
            modInfo.roomId = roomId;
        },
        getRoomId: function() {
            return modInfo.roomId;
        },
        setRoomName: function(name) {
            modInfo.roomName = name;
        },
        getRoomName: function() {
            return modInfo.roomName;  
        },
        setRoomPassword: function(roomPassword) {
            modInfo.roomPassword = roomPassword;
        },
        getRoomPassword: function() {
            return modInfo.roomPassword ;
        },
        setUserId: function(userId) {
            modInfo.userId = userId;     
        },
        getUserId: function() {
            return modInfo.userId;
        },
        setUsername: function(username) {
            modInfo.username = username;     
        },
        getUsername: function() {
            return modInfo.username;
        },
        getIsOwner : function() {
            return modInfo.isOwner;   
        },
        setIsOwner : function(value) {
            modInfo.isOwner = (value == modInfo.userId);   
        }
    };
});

questionApp.service('urlService', function() {
    return function() {
        returnValue = new Object();
        returnValue.baseURL = 'http://129.21.121.32:8080';
        returnValue.postRequest = {
            'method' : 'POST',
            'headers' : {'Content-Type': 'application/json'}
        };
        return returnValue;
    }
});

questionApp.service('questionMappingService', function() {
    return {
        'getJSON' : function(question) {
            return {
                'name' : question.name,
                'text' : question.description,
                'answer' : question.answer
            };
        },
        'JSONtoParticipant' : function(participant) {
            return {
                name: participant.name,
                id: participant._id,
                score: participant.score,
                locked: participant.locked,
                status: '#5abc7d'
            };
        },
        'JSONtoQuestion' : function(question) {
            return {
                name: question.name,
                description: question.text,
                answer: question.answer,
                id: question._id,
                editing: false,
                startEnabled: true
            };
        }
    };
});

//questionApp.service('socket', function() {
//    var socket = null;
//    return {
//        init: function(url, query) {
//           socket = io.connect(url, query);
//            console.log("HERE");
//        },
//        on: function(eventName, callback) {
//            socket.on(eventName, function () {  
//                var args = arguments;
//                $scope.$apply(function () {
//                    callback.apply(socket, args);
//                });
//            });   
//        }
//    };
//});
