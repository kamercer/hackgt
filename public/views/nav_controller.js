'use strict';

angular.module('tripApp.controllers')
.controller('NavCtrl', 
['$scope', '$location', function ($scope, $location) {
  $scope.navClass = function (page) {
    var currentRoute = $location.path().substring(1) || 'home';
    return page === currentRoute ? 'active' : '';
  };
  
  $scope.loadHome = function () {
        $location.url('/home');
    };
    
    $scope.loadAbout = function () {
        $location.url('/delta');
    };
    
}]);