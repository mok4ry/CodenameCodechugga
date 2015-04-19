var questionApp = angular.module('codechugga', ['ngRoute', 'ngAnimate', 'codeChuggaController']);


questionApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './templates/home.htm',
            controller  : 'HomeCtrl'
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
            templateUrl : './templates/compPage.htm',
            controller : 'CompController'
        })
              
        .otherwise({
            redirectTo : '/'
        })
}]);
