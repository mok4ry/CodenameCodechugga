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
            alert("Sending\n" + JSON.stringify(data));
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
                
                alert("Receiving:Data=" + JSON.stringify(data) +
                "\nStatus=" + status);

                $location.url('/comp');
              }).
              error(function(data, status, headers, config) {
                // TODO: More sophisticated error messsage
                alert("Data=" + JSON.stringify(data) +
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
            alert("Sending\n" + JSON.stringify(data));
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
                
                alert("Data=" + JSON.stringify(data) +
                "\nStatus=" + status);

                $location.url('/comp');
              }).
              error(function(data, status, headers, config) {
                // TODO: More sophisticated error messsage
                alert("Data=" + JSON.stringify(data) +
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

codeChuggaController.controller('CompController', ['$scope', function($scope) {
    $scope.questions = [
        {
            'name' : 'Question 1',
            'description' : 'This is a description',
            'answer' : 'answer',
        },
        
    ];
    $scope.newQuestionClicked = function() {
        $scope.questions.push({});
    }
}]);
