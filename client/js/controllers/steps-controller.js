/**
 * Created by jasmo2 on 5/29/16.
 */

angular.module('intellimining')

    .controller('StepsController', ['$rootScope','$scope','$log',
            function ($rootScope,$scope,$log) {

                $scope.stepOne = true ;
                $scope.stepTwo = false;
                $scope.step_three = false;
                var firstToSecondStep = function (modelError) {
                    $scope.$apply(function () {
                        $scope.stepOne = false;
                        $scope.stepTwo = true;
                        $scope.modelError = Math.floor(modelError*100);
                    });
                };
                $scope.$on('finalStep',function (event, args) {
                    $scope.$apply(function () {
                        $scope.stepOne = false;
                        $scope.stepTwo = false;
                        $scope.stepThree = true;
                    });
                });

            }
        ]
    );
