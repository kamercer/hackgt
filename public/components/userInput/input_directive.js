'use strict';

angular.module('tripApp.directives')
.directive('inputDirective', function(){
    return {
        restrict: 'E',
        templateUrl: 'components/userInput/input_view.html'
    }
});