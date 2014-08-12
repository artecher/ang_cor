/**
 * Created by ethan on 2014/8/4.
 */


angular.module('iFuelApp',['ngRoute','wizardApp'])
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
    })
    .controller('MainPageCtrl',function($scope) {
        console.debug("MainPageCtrl");

        //set the title value
        $scope.bodyObject.title="iFuel - Search";
        //reset the bodyResultArray value when comes to the search page
        $scope.bodyObject.bodyResultArray=[];

        var curLat, curLng, curPos;
        var map;

        //test code
        curLat=-36.897125;
        curLng=174.888187;
        curPos=new google.maps.LatLng(curLat, curLng);
        initialize(curPos);

        //get the current position with cordova
//        navigator.geolocation.getCurrentPosition(onSuccess, onError);


       function onSuccess(position) {
            curLat = position.coords.latitude;
            curLng = position.coords.longitude;
//            curLat = -36.897125;
//            curLng = 174.888187;
            curPos = new google.maps.LatLng(curLat, curLng);
            //initialize the map
            initialize(curPos);//initialize the map after all elements loaded, otherwise, errors could happen
        };

        //callback for getCurrentPosition

         // onError Callback receives a PositionError object
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }



        //for google map initialization
        function initialize(curPos) {
            var mapOptions = {
                zoom: 16,
                center: curPos,
                disableDefaultUI:true
            };
            map = new google.maps.Map(document.getElementById('welcome-map'),
                mapOptions);
            //add marker of current position
            var marker = new google.maps.Marker({
                position: curPos,
                map: map,
                title: 'Your current position'
            });
        }

        //initialize the value of input from preference
        if(angular.isDefined(window.localStorage)){
            var storage = window.localStorage;
            $scope.bodyObject.consumption = storage.getItem('iFuelPrefCons');
            if(angular.isDefined($scope.bodyObject.consumption)){
                $scope.bodyObject.consumption=parseInt($scope.bodyObject.consumption);
            }
            $scope.bodyObject.fillVol = storage.getItem('iFuelPrefTankVol');
            if(angular.isDefined($scope.bodyObject.fillVol)){
                $scope.bodyObject.fillVol =parseInt($scope.bodyObject.fillVol);
            }
        }

        //the search method
        //this method is bind to search button of mainPage
        $scope.search = function() {
            var searchReq = {
                location:curPos,
                radius:5000,
                types:['gas_station']
            };
            if(angular.isDefined(map)){
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(searchReq,processLoc);
            }else{
                alert('Map is not initialized!');
                return false;
            }
        };

        //callback function for the placesSearch service.
        //This function calls the distanceMatrix service using the locations returned by placesSearch service
        function processLoc(results,status) {
            if(status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
            }
            else{
                //calculate the distance
                var destinationArray=[];
                for(var idx in results){
                    //insert result entry to final result array
                    var resultEntry = new Object();
                    resultEntry.name = results[idx].name;
                    resultEntry.icon = results[idx].icon;
                    $scope.bodyObject.bodyResultArray.push(resultEntry);
                    destinationArray.push(results[idx].geometry.location);
                }
                var disService = new google.maps.DistanceMatrixService();
                disService.getDistanceMatrix(
                    {
                        origins:[curPos],
                        destinations:destinationArray,
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    },
                    processDistance
                )
            }
        }

        //callback function for returned distance matrix
        function processDistance(response,status) {
            if(status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
            }
            else{
                var destinations = response.destinationAddresses;
                var resultRow = response.rows[0].elements;//there is only one row coz only one origin
                var tempTotalCost = 0;//for calculation of average cost
                for(var idx in resultRow) {
                    //insert attributes to results for the search result page usage
                    var resultEntry = $scope.bodyObject.bodyResultArray[idx];
                    resultEntry.address = destinations[idx];
                    resultEntry.distanceStr = resultRow[idx].distance.text;
                    resultEntry.distanceVal = resultRow[idx].distance.value;
                    resultEntry.totalCost = calculatePrice(resultEntry);
                    tempTotalCost+=resultEntry.totalCost;
                    console.log('distance to '+destinations[idx] +' is '+resultRow[idx].distance.value);
                }

                var averageCost = tempTotalCost/ $scope.bodyObject.bodyResultArray.length;

                //set offsetAve attribute
                for(var i in  $scope.bodyObject.bodyResultArray) {
                    $scope.bodyObject.bodyResultArray[i].offsetAve = $scope.bodyObject.bodyResultArray[i].totalCost-averageCost;
                    console.log("offset cost: "+ $scope.bodyObject.bodyResultArray[i].offsetAve);
                }

                //redirect to the result page after callback function done its work.
                window.location="#/resultPage";
            }
        }

        function calculatePrice(resultEntry) {
            var travelCost = $scope.bodyObject.consumption/100*resultEntry.distanceVal/1000*$scope.bodyObject.fuelPrice;
            var fuelCost = $scope.bodyObject.fuelPrice * $scope.bodyObject.fillVol;
            console.log('travelCost '+travelCost);
            console.log('fuelCost '+fuelCost);
            return travelCost + fuelCost;
        }

    })
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

    })
    .controller('DefaultCtrl',function($scope) {
        //define page-level variables
        $scope.bodyObject = {};
        $scope.bodyObject.fuelPrice = 2.12;
        $scope.bodyObject.bodyResultArray = [];

    })
;


angular.module('wizardApp', [])
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