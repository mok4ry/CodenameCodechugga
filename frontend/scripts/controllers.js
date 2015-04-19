var codeChuggaController = angular.module('codeChuggaController', ['ngAnimate']); 

codeChuggaController.controller('HomeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.join = function() {
        $location.url('/join');
    }
    
    $scope.create = function() {
        $location.url('/create');
    }
}]);

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', '$location', 'loginService', 'urlService', function ($scope, $http, $location, loginService, urlService) {
    $scope.submit = function() {
        resetForms();
        var roomCode = $scope.joinName;
        var password = $scope.joinPassword;
        var username = $scope.joinUsername;
        alert("Room Code:" + roomCode +
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
                loginService.setRoomCode(roomCode);
                loginService.setRoomId(data.roomId);
                loginService.setUserId(data.userId);
                loginService.setUsername(username);
                console.log(loginService.info());
                
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
        alert("Room Code:" + roomCode +
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


codeChuggaController.controller('ModCompCtrl', ['$scope', '$http', '$location', 'modService', function ($scope, $http, $location, modService) {
    // establish socket here
    
}]);

codeChuggaController.controller('PartCompCtrl', ['$scope', '$http', '$location', 'loginService', function ($scope, $http, $location, loginService) {
    // establish socket here
    
}]);

codeChuggaController.controller('CompController', ['$scope', '$http', 'modService', 'urlService', 'questionMappingService', function($scope, $http, modService, urlService, questionMappingService) {
    $scope.questions = [];
    
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
