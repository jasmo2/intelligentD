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
                    self = this,
                    printPredictingVariables = function (variables) {
                        var predictingVariables = [];

                        for(var i = 0,l = variables.length; i < l; i+=1){
                           predictingVariables.push({is_checked: true, value: "–", label: variables[i]})
                        }
                        $scope.$apply(function () {
                            $scope['variables'] = predictingVariables;
                        });
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

                $scope.chooseVariables = function () {

                    $log.info("selected Variables: "+$scope.selectedVariables);

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
                $scope.selectedVariables= [];

                // Function to get data for all selected items
                $scope.selectAll = function (collection) {

                    // if there are no items in the 'selected' array, 
                    // push all elements to 'selected'
                    if ($scope.selected.length === 0) {

                        angular.forEach(collection, function(val) {

                            $scope.selected.push(val.id);

                        });

                        // if there are items in the 'selected' array, 
                        // add only those that ar not
                    } else if ($scope.selected.length > 0 && $scope.selected.length != $scope.data.length) {

                        angular.forEach(collection, function(val) {

                            var found = $scope.selected.indexOf(val.id);

                            if(found == -1) $scope.selected.push(val.id);

                        });

                        // Otherwise, remove all items
                    } else  {
                        $scope.selectedVariables= [];
                    }

                };
            }
        ]
    )
