'use strict';

angular.module('mat.app')
.service('fileUpload', ['$http', function ($http,$log) {
      this.uploadFileToUrl = function(file, uploadUrl,callback){
         var fd = new FormData();
         fd.append('file', file);

         $http.post(uploadUrl,fd,{
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })
          .then(function(response) {
              $log.info(response.data);
              callback;
          },function(err){
            $log.error(err);

          })
      }
 }])
.service('Blog', ['$resource',
  function ($resource) {
    return $resource('/api/blog', {},
      {update: {method: 'PUT'}}
    );
  }
])
.service('Entry', ['$resource',
  function ($resource) {
    return $resource('/api/entry', {},
      {update: {method: 'PUT'}}
    );
  }
]);
