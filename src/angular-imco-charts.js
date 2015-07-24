'use strict';

angular.module('imco.charts', [])

.directive('imcoLineChart', function($window) {

    return {
        restrict: 'EAC',
        scope: {
            config: '=?'
        },
        template: '<svg></svg>',
        link: function postLink(scope, iElement, iAttrs, controller) {
            if (!scope.config) {
                scope.config = {};
            }
            var d3 = $window.d3;
            var rawSvg = element.find('svg')[0];
            var svg = d3.select(rawSvg);
        },
        /*compile: function compile(tElement, tAttrs, transclude) {
            tElement.html('<span>hello {{name}}</span>');
            return function postLink(scope, iElement, iAttrs, controller) {
                scope.name = 'world';
            };
        }*/
    };

});
