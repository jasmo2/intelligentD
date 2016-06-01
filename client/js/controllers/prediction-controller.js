angular.module('intellimining')

  .controller('PredictionController', ['$rootScope','$scope','$http','$log','fileUpload',
        function ($rootScope,$scope,$http,$log,fileUpload) {
            var scope = $scope;
            // "/train_upload"
            $scope.$on('initializePredictionUploader',function () {
                $scope.train_csv = $rootScope.train_csv;
                $log.info("success Upload, scope.train: "+$scope.train_csv);
            });

            $scope.dropzonePrediction = {
                      'options': {
                            'url': 'prediction_upload',
                            'acceptedFiles': '.csv',
                            'dictDefaultMessage': 'Soltar o seleccionar archivo .csv'
                        },
                        'eventHandlers': {
                            'sending': function(file, xhr, formData) {
                                formData.append("trainCsv",   scope.train_csv)
                                $log.info("sending")
                            },
                            'success': function(file, response) {
                              $rootScope.$broadcast('finalStep',{data: response});
                              $log.info("success Prediction")
                            }

                        }
                    };

        }
    ]
)
