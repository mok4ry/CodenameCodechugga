var codeChuggaController = angular.module('codeChuggaController', ['ngAnimate']); 

codeChuggaController.controller('HomeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.join = function() {
        $location.url('/join');
    }
    
    $scope.create = function() {
        $location.url('/create');
    }
}]);

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.submit = function() {
        resetForms();
        var roomCode = $scope.joinName;
        var password = $scope.joinPassword;
        var username = $scope.joinUsername;
        alert("Room Code:" + roomCode +
            "\nPassword:" + password +
            "\nUsername:" + username);   

        if(validateForms(roomCode, password, username)) {
            // TODO: ERIC DO STUFF
            // navigate         
            $location.url('/#');
        }
    }
}]);

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.submit = function() {
        resetForms(); 
        var roomCode = $scope.createName;
        var password = $scope.createPassword;
        var username = $scope.createUsername;
        alert("Room Code:" + roomCode +
        "\nPassword:" + password +
        "\nUsername:" + username);   
        
        if(validateForms(roomCode, password, username)) {
            // TODO: ERIC DO STUFF
            // navigate
            $location.url('/#');
        }
    }
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
