/**
 * Created by ethan on 2014/8/12.
 */

describe('searchCtrl tests',function() {

    var scope, controller;

    beforeEach(angular.mock.module('iFuelApp'));

    beforeEach(angular.mock.inject(function($rootScope,$controller) {
        scope = $rootScope.$new();
        scope.bodyObject = {};

        controller = $controller('SearchCtrl',{$scope:scope});
    }));


    it('test calculatePrice',function() {
        var resultEntry = {};
        resultEntry.distanceVal = 1.5;

        scope.bodyObject.fuelPrice = 2;
        scope.bodyObject.consumption = 12;
        scope.bodyObject.fillVol=40;
        expect(scope.calculatePrice(resultEntry)).toEqual(80.00036);
    });

});
