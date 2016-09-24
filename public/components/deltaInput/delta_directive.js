'use strict';

angular.module('tripApp.directives')
.directive('deltaDirective', function(){
    return {
        restrict: 'E',
        templateUrl: 'components/deltaInput/delta_view.html'
    }
});