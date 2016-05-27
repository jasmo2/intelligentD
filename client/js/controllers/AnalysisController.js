angular.module('intellimining')

    .controller('AnalysisController', ['$rootScope','$scope','$http','$log','fileUpload',
            function ($rootScope,$scope,$http,$log,fileUpload) {
                $scope.controllerName = 'AnalysisController';

                $scope.uno = true ;
                $scope.dos = false;
                $scope.tres = false;

                var firstToSecondStep = function (modelError) {
                    $scope.$apply(function () {
                        $scope.uno = false;
                        $scope.dos = true;
                        $scope.modelError = Math.floor(modelError*100);
                    });
                },
                    printPredictingVariables = function (variables) {

                    };
                // "/train_upload"
                $scope.dropzoneConfig = {
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
                                $rootScope.train_csv = response['train_csv'];
                                // firstToSecondStep(response.error);
                                // $rootScope.$broadcast('initializePredictionUploader');
                                printPredictingVariables(response['variables']);
                            }

                        }
                    };


                $scope.$on('finalStep',function (event, args) {
                    $scope.$apply(function () {
                        $scope.uno = false;
                        $scope.dos = false;
                        $scope.tres = true;
                        $scope.tableM = JSON.parse(args.data);
                    });
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
