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
                console.log(data);
                // Propagate to service
                modService.setRoomCode(data.code);
                modService.setRoomId(data.roomId);
                modService.setRoomName(data.name);
                modService.setUserId(data.userId);
                modService.setUsername(username);
                modService.setIsOwner(data.owner._id)
                
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
                modService.setRoomCode(data.code);
                modService.setRoomId(data._id);
                modService.setRoomName(data.name);
                modService.setRoomPassword(password);
                modService.setUserId(data.owner._id);
                modService.setUsername(username);
                modService.setIsOwner(data.owner._id);
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
    
codeChuggaController.controller('CompController', ['$scope', '$http', '$location', 'modService', 'urlService', 'questionMappingService', function($scope, $http, $location, modService, urlService, questionMappingService) {
    if(!modService.getRoomId()) {
        alert("Re-login!");
        $location.url("/#");
        return;
    }
    
    $scope.questions = [];
    $scope.isOwner = modService.getIsOwner();
    $scope.title = modService.getRoomName() + " " + modService.getRoomCode();
    $scope.codeValue = '';
    
    var socket = io.connect(
    'http://localhost:8080', 
    { query:
        "roomId=" + modService.getRoomId() + 
        "&userId=" + modService.getUserId() 
    });
    
    // Socket listeners
    // ================
    socket.on('connected-to-competition', function (data) {
        if($scope.isOwner) {
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
        var quest = questionMappingService.JSONtoQuestion(data);
        if($scope.isOwner) {
            // No-op
        } else {
            $scope.questions = [];
            $scope.questions.push(quest);
        }
        
        console.log("Received 'new-active-challenge' with");
        console.log(data);
        $scope.$apply();
    });
    
    socket.on('active-challenge-updated', function (data) {
        if($scope.isOwner) {
            // No-op
        } else {
            var quest = questionMappingService.JSONtoQuestion(data);
            var target = $scope.questions[0];
            target.description = (quest.description) ? quest.description : target.description;
            target.name = (quest.name) ? quest.name : target.name;
            target.answer = (quest.answer) ? quest.answer : target.answer;
        }
        console.log("Received 'active-challenge-updated' with");
        console.log(data); 
        $scope.$apply();

    });
              
    socket.on('correct-answer-submitted', function (data) {
        var id = data.userId;
        var participants = $scope.participants;
        for(var i = 0; i < participants.length; i++) {
           if(participants[i].id === id) {
                participants[i].locked = false;   
           }
        }
        console.log(modService.getUserId() + " " + id);
        if(modService.getUserId() === id) {
            document.getElementById('codeArea').disabled = false;
            document.getElementById('codeArea').style.backgroundColor = '';
            document.getElementById('codeSubmit').disabled = false;
        }
        console.log("Received 'correct-answer-submitted' with");
        console.log(data); 
        $scope.$apply();
    });
    
    socket.on('incorrect-answer-submitted', function (data) {
        var id = data.userId;
        var participants = $scope.participants;
        for(var i = 0; i < participants.length; i++) {
           if(participants[i].id === id) {
                participants[i].locked = true;   
           }
        }
        console.log(modService.getUserId() + " " + id);
        if(modService.getUserId() === id) {
            document.getElementById('codeArea').disabled = true;
            document.getElementById('codeArea').style.backgroundColor = 'red';
            document.getElementById('codeSubmit').disabled = true;
        }
        console.log("Received 'incorrect-answer-submitted' with");
        console.log(data); 
        $scope.$apply();
    });
    
    socket.on('user-connected', function (data) {
        $scope.participants.push(questionMappingService.JSONtoParticipant(data));
        console.log("Received 'user-connected' with");
        console.log(data);
        $scope.$apply();
    });
    
    
    socket.on('user-disconnected', function (data) {
        var id = data.userId;
        $scope.participants = $scope.participants.filter( function(x) { return (x.id != id) } );
        console.log("Received 'user-disconnected' with");
        console.log(data);
        $scope.$apply();  
    });
    
    $scope.newQuestionClicked = function() {
        $scope.questions.push({'editing' : true, 'startEnabled' : true});
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
    
    $scope.cancelButtonClicked = function(question) {
        question.editing = false;
        questionIndex = $scope.questions.indexOf(question);
        $scope.questions.splice(questionIndex, 1);
    }
    
    $scope.startButtonClicked = function(question) {
        requestObject = urlService().postRequest;
        requestObject.url = urlService().baseURL + '/api/competitions/' + modService.getRoomId() + '/challenges/' + question.id + '/start';
        requestObject.method = 'PUT';
        
        $http(requestObject).success(function(data, status, headers, config) {
            console.log('Activated challenge');
            console.log(data)
            
            //Disable all start buttons
            startButtons = document.getElementsByClassName('startButton');
            for(i = 0; i < $scope.questions.length; i++) {
                currentQuestion = $scope.questions[i];
                currentQuestion.startEnabled = false;
            }
            
        }).error(function(data, status, headers, config) {
            console.error(data);
        });
    }
    
    $scope.submitCode = function (question) {
        var data = {};
        data.code = encodeURI($scope.codeValue);
        data.userId = modService.getUserId();
        requestObject = urlService().postRequest;
        requestObject.url = urlService().baseURL + '/api/competitions/' + modService.getRoomId() + '/challenges/' + question.id + "/submit";
        requestObject.method = 'POST';
        requestObject.data = data;
        $http(requestObject).success(function(data, status, headers, config) {
            alert("HOORAY");
        }).error(function(data, status, headers, config) {
            alert("NOOOO");
            console.error(data);
        });
    }
}]);
