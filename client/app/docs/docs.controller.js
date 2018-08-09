'use strict';

angular.module('namedropApp')
	.controller('DocCtrl', function ($scope,toastr,$location, $http) {
		$scope.$on('$viewContentLoaded', function() {
			Component.init();
		});
	});