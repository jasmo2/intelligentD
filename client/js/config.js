'use strict';

angular.module('intellimining').config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/jjfnhskodb', {
        templateUrl: '/static/partials/home.html',
        controller: 'HomeController'
      })
      .when('/', {
        templateUrl: '/static/partials/analysis.html',
        controller: 'AnalysisController'
      })
  }
]);
