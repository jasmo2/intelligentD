'use strict';

angular.module('mat.app')
  .controller('HomeController', ['$scope', 'Blog',
    function ($scope, Blog) {
      $scope.blogs = Blog.query();
    }
  ]
)



  .controller('AnalysisController', ['$scope','$http','$log','fileUpload',
    function ($scope,$http,$log,fileUpload) {
      $scope.controllerName = 'AnalysisController';
      var scope = $scope;
      $scope.uploadTrainSet = function () {
        var file = $scope.myFile;
        $log.log('file is ' );
        console.dir(file);
        fileUpload.uploadFileToUrl(file, "/train_upload",function(){
            //#fixme
        });
      }

    }
  ]
)
  .controller('AboutController', ['$scope',
    function ($scope) {
      $scope.controllerName = 'AboutController';
    }
  ]
);