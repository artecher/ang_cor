'use strict';

//Setting up route
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