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
        // "/train_upload"
        angular.extend($scope,$log, {
            newGallery: {},
            errorDiv: false,
            errorMessages: [],
            singleGallery: {},
            dropzoneConfig: {
                'options': {
                    'url': 'train_upload',
                    'acceptedFiles': '.csv',
                    'dictDefaultMessage': 'Soltar o seleccionar archivo .csv'
                },
                'eventHandlers': {
                    'sending': function(file, xhr, formData) {
                        $log.info("sending")
                    },
                    'success': function(file, response) {
                        $log.info("success")
                    }

                }
            }
        });
        
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