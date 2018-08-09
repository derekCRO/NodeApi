(function () {
  'use strict';

  angular.module('namedropApp')
    .service('tryService',tryService);

  tryService.$inject = ['$http', '$q'];
  function tryService($http, $q) {
    return {
      get: get
    };

    function get(params) {
      var uri = '/try/' + params.apiType + '?phrase=' + params.phrase;
      var deferred = $q.defer();

      $http.get(uri).
        success(function(data) {
          deferred.resolve(data);
        }).
        error(function(err) {
          deferred.reject(err);
        }.bind(this));

      return deferred.promise;
    }
  }
})();