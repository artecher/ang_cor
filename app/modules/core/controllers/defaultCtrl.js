/**
 * Created by ethan on 2014/8/12.
 */
'use strict';
/**
 * The parent controller for sub controllers to exchange data
 */
angular.module('iFuelApp')
.controller('BodyCtrl',function($scope) {
    //define page-level variables
    $scope.bodyObject = {};
    $scope.bodyObject.fuelPrice = 2.12;
    $scope.bodyObject.bodyResultArray = [];

});
