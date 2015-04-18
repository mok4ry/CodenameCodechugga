var codeChuggaController = angular.module('codeChuggaController', []); 

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', function ($scope, $http) {
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
            alert("Good stuff");
        }
    }
}]);

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', function ($scope, $http) {
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
            console.log("ASDF")
            alert("Good stuff");
        }
    }
}]);

function validateForms(room, pass, user) {
    var success = true;
    if(!room) {
        success = false;
        document.getElementById('roomname').style.borderColor = "red";
    }
    if(!pass) {
        success = false;
        document.getElementById('password').style.borderColor = "red";
    }
    if(!user) {
        success = false;
        document.getElementById('username').style.borderColor = "red";
    }
    return success;
}

function resetForms() {
    document.getElementById('roomname').style.borderColor = "";
    document.getElementById('password').style.borderColor = "";
    document.getElementById('username').style.borderColor = "";
}        
