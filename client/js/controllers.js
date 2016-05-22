'use strict';

angular.module('mat.app')
    .controller('HomeController', ['$scope', 'Blog',
            function ($scope, Blog) {
                $scope.blogs = Blog.query();
            }
        ]
    )



    .controller('AnalysisController', ['$rootScope','$scope','$http','$log','fileUpload',
            function ($rootScope,$scope,$http,$log,fileUpload) {
                $scope.controllerName = 'AnalysisController';

                $scope.uno = true ;
                $scope.dos = false;
                $scope.tres = false;

                var firstToSecondStep = function () {
                    $scope.$apply(function () {
                        $scope.uno = false;
                        $scope.dos = true;
                    });
                };
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
                                $rootScope.train_csv = response.train_csv;
                                firstToSecondStep();
                                $log.info("success Upload");
                                $rootScope.$broadcast('initializePredictionUploader');
                            }

                        }
                    }
                });

                $scope.$on('finalStep',function () {
                    $scope.$apply(function () {
                        $scope.uno = false;
                        $scope.dos = false;
                        $scope.tres = true;
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
    .controller('PredictionController', ['$rootScope','$scope','$http','$log','fileUpload',
            function ($rootScope,$scope,$http,$log,fileUpload) {
                var scope = $scope;
                // "/train_upload"
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
                                    $rootScope.$broadcast('finalStep');
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
    .controller('AboutController', ['$scope',
            function ($scope) {
                $scope.controllerName = 'AboutController';
            }
        ]
    );