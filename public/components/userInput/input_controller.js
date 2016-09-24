'use strict';

angular.module('tripApp.controllers')
.controller('inputController', ['$scope','$rootScope','$http',
    function($scope,$rootScope,$http){
        // var _curLoc = null;
        var _duration = null;
        $scope.curLoc = null;
        $scope.user = {
            // curLoc: function(newLoc) {
            //     return arguments.length ? (_curLoc = newLoc) : _curLoc;
            // },
            duration: function(newDuration) {
                return arguments.length ? (_duration = newDuration) : _duration;
            }
        };

        // $scope.isActive = function (viewLocation) { 
        //     return viewLocation === $location.path();
        // };

        $scope.send = function(){
            // var curloc = $scope.user.curLoc();
            var curloc = $scope.curLoc;
            var durat = $scope.user.duration();
            if(curloc==null || durat==null) alert("All fields should be filled to continue!");
            
            console.log("current location: "+curloc);
            console.log("current duration: "+durat);

            if(curloc&&durat) {
                var location = curloc.geometry.location,
                    lat      = location.lat(),
                    lng      = location.lng();
                console.log("Latitude: " + lat+ "\nLongitude: " + lng);
                window.location.href = '/results?lat='+lat+'&log='+lng+'&hours='+durat;

                /*$http.get('/results?lat='+lat+'&log='+lng+'&hours='+durat).success(function(res) {  
                    if(res) {
                        console.log(res);
                    } 
                });
                */
            } else alert("All fields should be filled to continue!");

            // var geocoder = new google.maps.Geocoder();
            // geocoder.geocode( { "address": curloc }, function(results, status) {
            //     if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            //         var location = results[0].geometry.location,
            //             lat      = location.lat(),
            //             lng      = location.lng();
            //         console.log("Latitude: " + lat+ "\nLongitude: " + lng);
            //         $http.get('/results?lat='+lat+'&log='+lng+'&hours='+durat).success(function(res) {  
            //             if(res) {
            //            
            //                 console.log(res);
            //             } 
            //         });
            //     } else {
            //         alert('Geocode was not successful for the following reason: ' + status);
            //     }
            // });


        };
}]);