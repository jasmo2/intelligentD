angular.module('mat.app')

  .controller('PredictionController', ['$rootScope','$scope','$http','$log','fileUpload',
        function ($rootScope,$scope,$http,$log,fileUpload) {
            var scope = $scope;
            // "/train_upload"
            scope.$on('initializePredictionUploader',function () {
                scope.$apply(function () {
                    scope.train_csv
                });
            });
            angular.extend($scope,$log, {
                    newGallery: {},
                    errorDiv: false,
                    errorMessages: [],
                    singleGallery: {},
                    dropzoneConfig: {
                        'options': {
                            'url': 'prediction_upload',
                            'acceptedFiles': '.csv',
                            'params': { csv: scope.train_csv },
                            'dictDefaultMessage': 'Soltar o seleccionar archivo .csv'
                        },
                        'eventHandlers': {
                            'sending': function(file, xhr, formData) {
                                $log.info("sending")
                            },
                            'success': function(file, response) {
                                $rootScope.$broadcast('finalStep',{data: response});
                                $log.info("success Prediction")
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
