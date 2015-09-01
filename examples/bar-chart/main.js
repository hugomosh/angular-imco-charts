/*global $:false */
'use strict';

/**
 * @ngdoc overview
 * @name 002FinanzasPublicasApp
 * @description
 * # 002FinanzasPublicasApp
 *
 * Main module of the application.
 */
angular
    .module('IMCOChartsBar', [
        'imco.charts'
    ])
    .controller('barController',
        function($scope) {

            $scope.dataTest = [];
            $scope.hola = "Hello bar!"
        }
    );
