/**
 * Created by ethan on 2014/8/12.
 */
'use strict';
angular.module('iFuelApp')
    .controller('ResultCtrl',function($scope) {
        console.debug("ResultCtrl");
        $scope.offsetAveCompare = function(offsetAve)
        {
            if(offsetAve>=0) {
                return 'higher';
            }else {
                return 'lower';
            }
        };

        //return the absolute value of the parameter
        $scope.abs = function(offsetAve) {
            if(offsetAve>=0) {
                return offsetAve;
            }else{
                return 0-offsetAve;
            }
        };

        //return the color class according to offset value
        $scope.aveClass = function(offsetAve) {
            if(offsetAve>=0) {
                return "label-warning";
            }else{
                return "label-success";
            }
        };

        //return logo according to the gas station name
        $scope.selectLogo= function(stationName) {
            if(/^Shell/.test(stationName)) {
                return 'img/gasStationLogos/Shell.png';
            }
            if(/^BP/.test(stationName)) {
                return 'img/gasStationLogos/BP.png';
            }
            if(/^Caltex/.test(stationName)) {
                return 'img/gasStationLogos/Caltex.png';
            }
            if(/^Gas Moore/.test(stationName)) {
                return 'img/gasStationLogos/default.png';
            }
            if(/^PSL Mobil/.test(stationName)) {
                return 'img/gasStationLogos/default.png';
            }
            if(/^Z/.test(stationName)) {
                return 'img/gasStationLogos/Z.png';
            }
            if(/^PAK'nSAVE/.test(stationName)) {
                return 'img/gasStationLogos/paknsave.jpg';
            }
            if(/^Mobil/.test(stationName)) {
                return 'img/gasStationLogos/Mobil.jpg';
            }
            //more logos


            return 'img/gasStationLogos/default.png';

        };

    });