'use strict';

//// Setting up route
//angular.module('core').config(['$stateProvider', '$urlRouterProvider',
//	function($stateProvider, $urlRouterProvider) {
//		// Redirect to home view when route not found
//		$urlRouterProvider.otherwise('/');
//
//		// Home state routing
//		$stateProvider.
//		state('home', {
//			url: '/',
//			templateUrl: 'modules/core/views/home.html',
//            controller: 'HomeController'
//		});
//	}
//]);


angular.module('iFuelApp',['ngRoute'])
    .config(function($routeProvider) {
        //dispatch requests
        $routeProvider
            .when('/wizardPage',{
                templateUrl:'modules/core/views/wizardView.html'
            })
            .when('/mainPage',{
                templateUrl:'modules/core/views/mainPageView.html'
            })
            .when('/resultPage',{
                templateUrl:'modules/core/views/resultView.html'
            })
            .otherwise({
                templateUrl:'modules/core/views/wizardView.html'
            });
    });