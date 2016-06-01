/**
 * Created by jasmo2 on 5/31/16.
 */
'use strict';

angular.module('intellimining')
    .service('Analysis', ['$http','$log',
        function ($http,$log) {
            var analysis = {
                perform: function (obj,callback) {
                    var selectedVariables = obj.rowCollection.filter(function(rowObj){
                        return ( obj.selectedVariables.indexOf(rowObj['$$hashKey']) == -1 ) ? false:true;
                    });
                    $http.post('/analysis',{'train_csv': obj.train_csv , 'selectedVariables': selectedVariables})
                    .then(
                        function(response) {
                            callback(response);
                        },
                        function(err){
                            swal({
                                title: "Error",
                                type: "error",
                                text: err.statusText,
                                timer: 2000,
                                showConfirmButton: false
                            });
                            $log.error(err);
                        }
                    )
                }
                };
            return analysis;
        }]);