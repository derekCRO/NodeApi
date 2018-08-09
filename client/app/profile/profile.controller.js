'use strict';

angular.module('namedropApp')
	.controller('ProfileCtrl', function ($scope, $rootScope, toastr, $location, $http, $state, Auth) {
		$scope.$on('$viewContentLoaded', function() {
			Component.init();
		});

		$scope.userInfo = $rootScope.user;
		$scope.pwd = {};

		$scope.updateKey = function () {
			Auth.changeKey()
				.then(function() {
					toastr.success('Your key has been updated successfully.', 'Success', {timeOut: 3000});
				})
				.catch(function(err) {
					if(err.data == 'unauthorized') {
						toastr.error('Your session is expired.', 'Error', {timeOut: 3000});
						Auth.logout();
						$state.go('main.auth');
					}
					else {
						toastr.error(err.data, 'Error', {timeOut: 3000});
					}
				});
		}

		$scope.updateInfo = function () {
			Auth.changeInfo($scope.userInfo)
				.then(function() {
					toastr.success('Your profile has been updated successfully.', 'Success', {timeOut: 3000});
				})
				.catch(function(err) {
					if(err.data == 'unauthorized') {
						toastr.error('Your session is expired.', 'Error', {timeOut: 3000});
						Auth.logout();
						$state.go('main.auth');
					}
					else {
						toastr.error(err.data, 'Error', {timeOut: 3000});
					}
				});
		}

		$scope.updatePwd = function () {
			if($scope.pwd.new_password !== $scope.pwd.password_confirmation)
				toastr.error('New Password doesn\'t match', 'Error', {timeOut: 3000});

			Auth.changePassword($scope.pwd.password, $scope.pwd.new_password)
				.then(function() {
					toastr.success('Your password has been updated successfully.', 'Success', {timeOut: 3000});
				})
				.catch(function(err) {
					if(err.data == 'unauthorized') {
						toastr.error('Your session is expired.', 'Error', {timeOut: 3000});
						Auth.logout();
						$state.go('main.auth');
					}
					else {
						toastr.error(err.data, 'Error', {timeOut: 3000});
					}
				});
		}
	});