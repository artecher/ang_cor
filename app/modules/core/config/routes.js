'use strict';

//Setting up route
angular.module('iFuelApp',['ngRoute'])
    .config(function($routeProvider) {
        //dispatch requests
        $routeProvider
            .when('/wizardPage',{
                templateUrl:'modules/core/views/wizardView.html'
            })
            .when('/searchPage',{
                templateUrl:'modules/core/views/searchPageView.html'
            })
            .when('/resultPage',{
                templateUrl:'modules/core/views/resultView.html'
            })
            .otherwise({
                templateUrl:'modules/core/views/wizardView.html'
            });
    });