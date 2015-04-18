var codeChuggaController = angular.module('codeChuggaController', []); 

codeChuggaController.controller('JoinCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.test = function() {
        console.log("YEP");   
    }
}]);

codeChuggaController.controller('CreateCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.test = function() {
        console.log("YEP");   
    }
}]);