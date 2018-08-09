'use strict';

angular.module('namedropApp')
	.controller('TryCtrl', function ($scope, toastr, $location, $http, $state, tryService) {
		$scope.$on('$viewContentLoaded', function() {
			Component.init();
		});

		$scope.o_domain = "https://developers.ournameshop.com/try/";
		$scope.request ={
			apiType : 'logo',
			phrase : ''
		};
		$scope.response = '';
		$scope.resp = '';

		$scope.send = function (form){
			$scope.o_domain = "https://developers.ournameshop.com/try/";
			$scope.o_domain = $scope.o_domain + $scope.request.apiType + '?phrase=' + $scope.request.phrase;

			tryService.get($scope.request)
				.then(function(data) {
					$scope.response = JSON.stringify(data, null, 2);
					$scope.resp = data;
				})
				.catch(function(err) {
					toastr.error(err, 'Error', {timeOut: 3000});
				});
		}
	});