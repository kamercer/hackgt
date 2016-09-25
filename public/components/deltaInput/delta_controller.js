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
                console.log("arriving num "+$scope.aflightNum+" departing num "+$scope.dflightNum
                    +" arriving time "+$scope.aflightTime+" departing time "+$scope.dflightTime);
                window.location.href = '/results?arrivingFlightNumber='+$scope.aflightNum+'&arrivingFlightTime='+$scope.aflightTime
                +'&departingFlightNumber='+$scope.dflightNum+'&departingFlightTime='+$scope.dflightTime;
            } else alert("All fields should be filled to continue!");

        };

        // $scope.today = function() {
        //     $scope.dt = new Date();
        // };
        // $scope.today();

        // $scope.clear = function() {
        //     $scope.dt = null;
        // };

        // $scope.inlineOptions = {
        //     customClass: getDayClass,
        //     minDate: new Date(),
        //     showWeeks: true
        // };

        // $scope.dateOptions1 = {
        //     dateDisabled: false,
        //     formatYear: 'yy',
        //     maxDate: new Date(2020, 5, 22),
        //     minDate: new Date(),
        //     startingDay: 1
        // };
        // $scope.open1 = function() {
        //     $scope.popup1.opened = true;
        //     $scope.aflightTime = $scope.dt;
        // };

        // $scope.open2 = function() {
        //     $scope.popup2.opened = true;
        //     $scope.dflightTime = $scope.dt;
        // };

        // $scope.setDate = function(year, month, day) {
        //     $scope.dt = new Date(year, month, day);
        // };

        // $scope.popup1 = {
        //     opened: false
        // };

        // $scope.popup2 = {
        //     opened: false
        // };

        // var tomorrow = new Date();
        // tomorrow.setDate(tomorrow.getDate() + 1);
        // var afterTomorrow = new Date();
        // afterTomorrow.setDate(tomorrow.getDate() + 1);
        // $scope.events = [
        //     {
        //     date: tomorrow,
        //     status: 'full'
        //     },
        //     {
        //     date: afterTomorrow,
        //     status: 'partially'
        //     }
        // ];

        // function getDayClass(data) {
        //     var date = data.date,
        //     mode = data.mode;
        //     if (mode === 'day') {
        //     var dayToCheck = new Date(date).setHours(0,0,0,0);

        //     for (var i = 0; i < $scope.events.length; i++) {
        //         var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        //         if (dayToCheck === currentDay) {
        //         return $scope.events[i].status;
        //         }
        //     }
        //     }

        //     return '';
        // }

}]);