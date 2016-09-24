'use strict';

angular.module('tripApp', 
    [
    'ui.bootstrap',
    'tripApp.controllers',
    'tripApp.directives',
    'google.places',
    'ngRoute',
    ])
    .config(['$locationProvider' ,'$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/home',
            {
                template: '<input-directive></input-directive>'
                // templateUrl:    '/views/home.html',
            });
            $routeProvider.when('/delta',
            {
                // templateUrl:    '/views/delta.html',
                template: '<delta-directive></delta-directive>'
            });
            // $routeProvider.when('/directions',
            // {
            //     templateUrl:    'directions.html',
            // });
            $routeProvider.otherwise(
            {
                redirectTo:     '/home',
            });

        }]);

angular.module('tripApp.controllers', []);
angular.module('tripApp.directives', []);