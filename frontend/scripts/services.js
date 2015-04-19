questionApp.service("loginService", function() {
    var loginInfo = {
        roomCode: "",
        roomId: "",
        userId: "",
        username: ""
    };
    
    return {
        info:function() {
            return loginInfo;
        },
        setRoomCode: function(roomCode) {
            loginInfo.roomCode = roomCode;
        },
        getRoomCode: function() {
            return loginInfo.roomCode;
        },
        setRoomId: function(roomId) {
            loginInfo.roomId = roomId;
        },
        getRoomId: function() {
            return loginInfo.roomId;
        },
        setUserId: function(userId) {
            loginInfo.userId = userId;     
        },
        getUserId: function() {
            return loginInfo.userId;
        },
        setUsername: function(username) {
            loginInfo.username = username;     
        },
        getUsername: function() {
            return loginInfo.username;
        }
    };
});

questionApp.service("modService", function() {
    var modInfo = {
        roomCode: "",
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
            modInfo.isOwner = value;   
        }
    };
});

questionApp.service('urlService', function() {
    return function() {
        returnValue = new Object();
        returnValue.baseURL = 'http://localhost:8080';
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
        }
    };
});