var codeChuggaController = angular.module('codeChuggaController', ['ngAnimate']); 

codeChuggaController.controller('HomeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.join = function() {
        $location.url('/join');
    }
    
    $scope.create = function() {
        $location.url('/create');
    }
}]);

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', '$location', 'loginService', function ($scope, $http, $location, loginService) {
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
            $http({url: "http://localhost:8080/api/competitions/" + roomCode,
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

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', '$location', 'modService', function ($scope, $http, $location, modService) {
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
            $http({url: "http://localhost:8080/api/competitions",
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

codeChuggaController.controller('CompCtlr', ['$scope', function($scope) {
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
    }
    
    $scope.editButtonClicked = function(question) {
        questionIndex = $scope.questions.indexOf(question);
        $scope.questions[questionIndex].editing = true;
    }
    
    $scope.saveButtonClicked = function(question) {
        question.editing = false;
        
        questionIndex = $scope.questions.indexOf(question);
        $scope.questions[questionIndex] = question;
    }
}]);
