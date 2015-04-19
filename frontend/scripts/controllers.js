var codeChuggaController = angular.module('codeChuggaController', ['ngAnimate']); 

codeChuggaController.controller('HomeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.join = function() {
        $location.url('/join');
    }
    
    $scope.create = function() {
        $location.url('/create');
    }
}]);


codeChuggaController.controller('JoinCtrl', ['$scope', '$http', '$location', 'modService', 'urlService', function ($scope, $http, $location, modService, urlService) {
    $scope.submit = function() {
        resetForms();
        var roomCode = $scope.joinName;
        var password = $scope.joinPassword;
        var username = $scope.joinUsername;
        console.log("Room Code:" + roomCode +
            "\nPassword:" + password +
            "\nUsername:" + username);   

        if(validateForms(roomCode, password, username)) {
            var data = {
                password: password,   
                username: username
            };
            console.log("Sending\n" + JSON.stringify(data));
            $http({url: urlService().baseURL + '/api/competitions/' + roomCode,
            method: "PUT",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}}).
              success(function(data, status, headers, config) {
                // Propagate to service
                modService.setRoomCode(roomCode);
                modService.setRoomId(data.roomId);
                modService.setUserId(data.userId);
                modService.setUsername(username);
                console.log(modService.info());
                
                console.log("Receiving:Data=" + JSON.stringify(data) +
                "\nStatus=" + status);

                $location.url('/comp');
              }).
              error(function(data, status, headers, config) {
                // TODO: More sophisticated error messsage
                alert("ERROR\n:Data=" + JSON.stringify(data) +
                     "\nStatus=" + status);
              });
        }
    }
}]);

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', '$location', 'modService', 'urlService', function ($scope, $http, $location, modService, urlService) {
    $scope.submit = function() {
        resetForms(); 
        var roomCode = $scope.createName;
        var password = $scope.createPassword;
        var username = $scope.createUsername;
        console.log("Room Code:" + roomCode +
        "\nPassword:" + password +
        "\nUsername:" + username);   
        
        if(validateForms(roomCode, password, username)) {
            var data = {
                username: username,
                roomName: roomCode,
                roomPassword: password   
            };
            console.log("Sending\n" + JSON.stringify(data));
            $http({url: urlService().baseURL + '/api/competitions',
            method: "POST",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}}).
              success(function(data, status, headers, config) {
                // Propagate to service
                modService.setRoomCode(roomCode);
                modService.setRoomId(data._id);
                modService.setRoomPassword(password);
                modService.setUserId(data.owner._id);
                modService.setUsername(username);
                console.log(modService.info());
                
                console.log("Data=" + JSON.stringify(data) +
                "\nStatus=" + status);

                $location.url('/comp');
              }).
              error(function(data, status, headers, config) {
                // TODO: More sophisticated error messsage
                alert("ERROR\n:Data=" + JSON.stringify(data) +
                     "\nStatus=" + status);
              });
        }
    }
}]);

codeChuggaController.controller('CompController', ['$scope', '$http', 'modService', 'urlService', 'questionMappingService', function($scope, $http, modService, urlService, questionMappingService) {
    var socket = io.connect(
    'http://localhost:8080', 
    { query:
        "roomId=" + modService.getRoomId() + 
        "&userId=" + modService.getUserId() 
    });
    
    // Socket listeners
    // ================
    socket.on('connected-to-competition', function (data) {
        // TODO: Moderator view , all challenges
        var isModerator = true; // DELETE ME
        if(isModerator) {
            $scope.questions = data.challenges;
        }
        if(data.running) {
            $scope.activeQuestion = data.activeChallenge;
        }
        $scope.participants = [];
        for(var i = 0; i < data.members.length; i++) {
            $scope.participants.push(questionMappingService.JSONtoParticipant(data.members[i]));
        }
        console.log($scope.participants);
        console.log("Received 'connected-to-competition' with");
        console.log(data);
        $scope.$apply();
    });
    
    socket.on('new-active-challenge', function (data) {
        $scope.activeQuestion = data
        // TODO:
            // Mod: Highlight the right question
            // Part: Only display active challenge
    });
              
    socket.on('correct-answer-submitted', function (data) {
        // TODO: Update view for the userId    
    });
    
    socket.on('user-connected', function (data) {
        $scope.participants.push(questionMappingService.JSONtoParticipant(data));
        console.log("Received 'user-connected' with");
        console.log(data);
        $scope.$apply();
    });
    
    socket.on('incorrect-answer-submitted', function (data) {
        // TODO: Update view for the userId    
    });
    
    socket.on('user-disconnected', function (data) {
        var id = data.userId;
        $scope.participants = $scope.participants.filter( function(x) { return (x.id != id) } );
        console.log("Received 'user-disconnected' with");
        console.log(data);
        $scope.$apply();  
    });
    
    $scope.questions = [
        {
            'name' : 'Question 1',
            'description' : 'This is a description',
            'answer' : 'This is the answer',
            'editing' : false
        },
        
    ];
    
    $scope.newQuestionClicked = function() {
        $scope.questions.push({'editing' : true});
        console.log($scope.questions)
    }
    
    $scope.editButtonClicked = function(question) {
        questionIndex = $scope.questions.indexOf(question);
        $scope.questions[questionIndex].editing = true;
    }
    
    $scope.saveButtonClicked = function(question) {
        requestObject = urlService().postRequest;
        
        //Create new question otherwise update
        if(!question.id) {
            requestObject.url = urlService().baseURL + '/api/competitions/' + modService.getRoomId() + '/challenges';
            requestObject.data = questionMappingService.getJSON(question);

            $http(requestObject).success(function(data, status, headers, config) {
                //Update the question id and editing modes
                question.id = data._id;
                question.editing = false;

                questionIndex = $scope.questions.indexOf(question);
            $scope.questions[questionIndex] = question;
            }).error(function(data, status, headers, config) {
                console.error(data);  
            });
        }
        else {
            requestObject.url = urlService().baseURL + '/api/competitions/' + modService.getRoomId() + '/challenges/' + question.id;
            requestObject.method = 'PUT';
            requestObject.data = questionMappingService.getJSON(question);
            $http(requestObject).success(function(data, status, headers, config) {
                question.editing = false;
                console.log(data);
            }).error(function(data, status, headers, config) {
                console.error(data);
            });
        }
    }
}]);
