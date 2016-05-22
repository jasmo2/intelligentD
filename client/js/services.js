'use strict';

angular.module('mat.app')
.service('fileUpload', ['$http','$log',
    function ($http,$log) {
      this.uploadFileToUrl = function(file, uploadUrl,callback){
         var fd = new FormData();
         fd.append('file', file);

         $http.post(uploadUrl,fd,{
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })
          .then(function(response) {
              $log.info(response.data);
              callback(response);
          },function(err){
            $log.error(err);

          })
      }
 }]);
