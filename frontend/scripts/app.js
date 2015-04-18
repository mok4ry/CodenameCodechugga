var questionApp = angular.module('codechugga', ['ngRoute', 'codeChuggaController']);


questionApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './templates/home.htm'
        })
              
        .when('/join', {
            templateUrl : './templates/join.htm',
            controller  : 'JoinCtrl'
        })
    
        .when('/create', {
            templateUrl : './templates/create.htm',
            controller  : 'CreateCtrl'
        })
              
        .when('/comp', {
            templateUrl : './templates/compPage.htm'  
        })
              
        .otherwise({
            redirectTo : '/'
        })
}]);
