var codeChuggaController = angular.module('codeChuggaController', []); 

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.submit = function() {
        var roomCode = $scope.joinName;
        var password = $scope.joinPassword;
        var username = $scope.joinUsername;
        // TODO: ERIC DO STUFF
        alert("Room Code:" + roomCode +
            "\nPassword:" + password +
             "\nUsername:" + username);   
    }
}]);

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.submit = function() {
        var roomCode = $scope.createName;
        var password = $scope.createPassword;
        var username = $scope.createUsername;   
        // TODO: ERIC DO STUFF
        
        alert("Room Code:" + roomCode +
        "\nPassword:" + password +
        "\nUsername:" + username);   
    }
}]);