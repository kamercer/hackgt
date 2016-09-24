'use strict';

angular.module('tripApp.controllers')
.controller('inputController', ['$scope','$rootScope','$http',
    function($scope,$rootScope,$http){
        var _curLoc = null;
        var _duration = null;

        $scope.user = {
            curLoc: function(newLoc) {
            // Note that newName can be undefined for two reasons:
            // 1. Because it is called as a getter and thus called with no arguments
            // 2. Because the property should actually be set to undefined. This happens e.g. if the
            //    input is invalid
                return arguments.length ? (_curLoc = newLoc) : _curLoc;
            },
            duration: function(newDuration) {
                return arguments.length ? (_duration = newDuration) : _duration;
            }
        };
        $scope.send = function(){
            var curloc = $scope.user.curLoc();
            var durat = $scope.user.duration();
            console.log("current location: "+$scope.user.curLoc());
            console.log("current duration: "+$scope.user.duration());

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { "address": curloc }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location,
                        lat      = location.lat(),
                        lng      = location.lng();
                    console.log("Latitude: " + lat+ "\nLongitude: " + lng);
                    $http.get('/results?lat='+lat+'&log='+lng+'&hours='+durat).success(function(res) {  
                        if(res) {
                        /** Here is where you can display the map after results are obtained from the server */
                        } 
                    });
                }
            });


        };
}]);