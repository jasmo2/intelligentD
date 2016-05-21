'use strict';

angular.module('mat.app').config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/static/partials/home.html',
        controller: 'HomeController'
      })
      .when('/analysis', {
        templateUrl: '/static/partials/analysis.html',
        controller: 'AnalysisController'
      })
  }
]);
