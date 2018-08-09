'use strict';

angular.module('namedropApp')
	.controller('GettingstartCtrl', function ($scope,toastr,$location, $http,$state) {
		$scope.$on('$viewContentLoaded', function() {
			Reveal.init();
			Component.init();
		});
	});