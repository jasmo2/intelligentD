/**
 * Created by jasmo2 on 5/29/16.
 */
angular.module('intellimining')

    .controller('ResultsController', ['$rootScope','$scope','$http','$log',
            function ($rootScope,$scope,$http,$log) {
                $scope.templateState = false;
                $scope.getPredictionFile = function () {
                    $http({method: 'GET', url: '/prediction_upload', params:{"trainCsv": $rootScope.train_csv}})
                        .then(function(response) {
                            var anchor = angular.element('<a/>');
                            anchor.attr({
                                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                                target: '_blank',
                                download: 'prediction.csv'
                            })[0].click();
                    },function (err) {
                                $log.error(err);
                                swal({
                                    title: "Error",
                                    type: "error",
                                    text: err.statusText,
                                    timer: 2000,
                                    showConfirmButton: false
                                });
                            }
                        );
                };
                 $scope.$on('finalStep',function (event, args) {
                    $scope.$apply(function () {
                        $scope.templateState = true;
                        $scope.confusion_matrix = $rootScope.confusion_matrix;
                    });
                });
            }
        ]
    );
