angular.module('intellimining')
    .controller('AnalysisController', ['$rootScope','$scope','$http','$log','Analysis','fileUpload',
        function ($rootScope,$scope,$http,$log,Analysis,fileUpload) {
            var printPredictingVariables = function (variables) {
                var predictingVariables = [];
                for(var i = 0,l = variables.length; i < l-1; i+=1){
                    var predictionVariable = i < (l-1) ? true : false;
                    predictingVariables.push({is_checked: predictionVariable, selected: predictionVariable, value: "–", label: variables[i]})
                }
                $scope.$apply(function () {
                    $scope['rowCollection'] = predictingVariables;
                    $scope['showVariables'] = true;
                });
            };
            $scope.reUploadFile = function () {
                if($scope['rowCollection'].length !== 0){
                    $scope['showVariables'] = $scope['showVariables'] ? undefined : true;
                }
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
            $scope.selectedVariables= [];
            $scope.rowCollection = [];
            // Function to get data for individual selected items
            $scope.select = function(hashKey) {
               var found = $scope.selectedVariables.indexOf(hashKey);
                if(found == -1){
                    $scope.selectedVariables.push(hashKey);
                }else{
                    $scope.selectedVariables.splice(found, 1);
                }
                $log.log("selectedVariables: "+ $scope.selectedVariables[$scope.selectedVariables.length-1]);
            };

            // Function to get data for all selected items
            $scope.selectAll = function (collection) {
                // if there are no items in the 'selected' array,
                // push all elements to 'selected'
                if ($scope.selectedVariables.length === 0) {
                    angular.forEach(collection, function(val) {
                        $scope.selectedVariables.push(val['$$hashKey']);
                    });
                    // if there are items in the 'selectedVariables' array,
                    // add only those that ar not
                } else if ($scope['selectedVariables'].length > 0  && $scope['selectedVariables'].length != $scope['variables'].length) {
                    angular.forEach(collection, function(val) {
                        var found = $scope.selectedVariables.indexOf(val['$$hashKey']);
                        if(found == -1) $scope.selectedVariables.push(val['$$hashKey']);
                    });
                    // Otherwise, remove all items
                } else  {
                    $scope.selectedVariables= [];
                }
            };
            // Array Depth copy
            $scope.variables = [].concat($scope.rowCollection);
            $scope.chooseVariables = function () {
                // firstToSecondStep(response.error);
                if ($scope.selectedVariables.length !== 0){
                    $scope.train_csv = $rootScope.train_csv;

                    Analysis.perform($scope,function (response) {
                        var modelError = response.data.error;
                        $rootScope.$broadcast('initializePredictionUploader',{'modelError': modelError});
                        $rootScope.$broadcast('firstToSecondStep',{'modelError': modelError});
                    });
                }else{
                    swal("Missing data",
                        "Choose at least on feature",
                        "warning")
                }
            }
        }]
    );
