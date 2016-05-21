'use strict';

angular.module('mat.app')
.service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl){
         var fd = new FormData();
         fd.append('file', file);
         debugger
         $http.post(uploadUrl,fd)
          .then(function(response) {
            $log.info(response.data);
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
