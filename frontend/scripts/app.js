var questionApp = angular.module('codechugga', ['ngRoute']);


questionApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './templates/home.htm'
        })
        
        .when('/comp', {
            templateUrl : './templates/compPage.htm'  
        })
    
        .otherwise({
            redirectTo : '/'
        })
}]);
