'use strict';

angular.module('tripApp.controllers')
.controller('deltaController', ['$scope','$rootScope','$http',
    function($scope,$rootScope,$http){
        $scope.aflightNum = null;
        $scope.dflightNum = null;
        $scope.aflightTime = null;
        $scope.dflightTime = null;

        $scope.send = function(){
            // if($scope.aflightNum==null || $scope.dflightNum==null
            //     || $scope.aflightTime==null || $scope.dflightTime==null) alert("All fields should be filled to continue!");
            if($scope.aflightNum && $scope.dflightNum && $scope.aflightTime && $scope.dflightTime) {
                console.log($scope.aflightNum,$scope.dflightNum, $scope.aflightTime, $scope.dflightTime);
                window.location.href = '/results?arrivingFlightNumber='+$scope.aflightNum+'&arrivingFlightTime='+$scope.aflightTime
                +'&departingFlightNumber='+$scope.dflightNum+'&departingFlightTime='+$scope.dflightTime;
            } else alert("All fields should be filled to continue!");

        };
}]);