'use strict';

angular.module('namedropApp')
	.controller('FooterCtrl', function ($scope, $rootScope, $window, $location, $state, Auth, toastr) {
		$scope.$on('$viewContentLoaded', function() {
			Component.init();
		});
	});
