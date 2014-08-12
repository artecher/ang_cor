/**
 * Created by ethan on 2014/8/4.
 */

angular.module('iFuelApp')
    .controller('wizardCtrl', function ($http, $scope) {
        console.debug('wizardCtrl');
        //set the title value
        $scope.bodyObject.title="iFule - Configuration";

        //get the model information from local json file

        $http.get('data/carModels.json')
            .success(function(data) {
                    $scope.carModels = data;
            })
            .error(function(error) {
                alert("Error getting storage data: "+error);
            });

        $scope.$watch('selectedModel',function() {
            if(angular.isDefined($scope.selectedModel) && angular.isDefined($scope.carModels)){
                $scope.consumption = $scope.carModels[$scope.selectedModel].fuelConsumption;
                $scope.tankVol = $scope.carModels[$scope.selectedModel].tankVolumn;
            };
        });

        $scope.next = function(){
            //store the choice and got to next
            if(angular.isDefined(window.localStorage)){
                var storage = window.localStorage;
                storage.setItem('isiFuelPrefSaved', true);
                storage.setItem('iFuelPrefCarModel', $scope.selectedModel);
                storage.setItem('iFuelPrefCons', $scope.consumption);
                storage.setItem('iFuelPrefTankVol', $scope.tankVol);
            }else{
                alert("Preference is not saved, but we can go on...")
            }
        };
    });