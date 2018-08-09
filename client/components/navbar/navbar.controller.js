'use strict';

angular.module('namedropApp')
	.controller('NavbarCtrl', function ($scope, $rootScope, $window, $location, $state, Auth, toastr) {

		$scope.logout = function () {
			Auth.logout();
			toastr.success('You are logged out successfully', 'Success', {timeOut: 3000});
			$state.transitionTo('main');
		}
	});
