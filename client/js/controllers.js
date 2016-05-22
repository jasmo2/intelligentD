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
        $scope.uno = true;
        $scope.dos = false;
        $scope.tres = false;
        $scope.uploadTrainSet = function () {
        var file = $scope.myFile;
        $log.log('file is ' );
        console.dir(file);
        fileUpload.uploadFileToUrl(file, "/train_upload",function(response){
            $scope.modelError = response['data']['error']
            $scope.modelGenerated = true;
        });
      };
      $scope.predictValues = function () {
        var file = $scope.predictFile;
        $log.log('file is ' );
        console.dir(file);
        fileUpload.uploadFileToUrl(file, "/prediction_upload",function(response){
           
        });
      }
    $scope.isModelGenerated = function(){
        if ($scope.modelGenerated){
              return true;
            }else {
              return false;
            }
          };
    }
  ]
)
  .controller('AboutController', ['$scope',
    function ($scope) {
      $scope.controllerName = 'AboutController';
    }
  ]
);