'use strict';

angular.module('namedropApp')
	.controller('AuthCtrl', function ($scope, toastr, $location, $http, $state, Auth) {
		$scope.$on('$viewContentLoaded', function() {
			Reveal.init();
			Component.init();
		});

		$scope.regChecked = false;
		$scope.forgotChecked = false;
		$scope.login_user = {};
		$scope.user = {};

		$scope.login = function (userData) {
			Auth.login({
				email: $scope.login_user.email,
				password: $scope.login_user.password
			})
				.then(function() {
					toastr.success('You are logged in successfully.', 'Success', {timeOut: 3000});
					$state.go('main.profile');
				})
				.catch(function(err) {
					$scope.errors = {};
					var err = err.message;
					if (err) {
						$scope.errors['login'] = err;
						toastr.error($scope.errors['login'], 'Error', {timeOut: 3000});
					}
					angular.forEach(err.errors, function(error, field) {
						form[field].$setValidity('database', false);
						$scope.errors[field] = error.message;
					});
				});
		}

		$scope.register = function (userData) {
			Auth.createUser($scope.user)
				.then(function() {
					// Account created, redirect to home
					toastr.success('You signned up successfully.', 'Success', {timeOut: 3000});
					$state.go('main.profile');
				})
				.catch(function(err) {
					err = err.data;
					$scope.errors = {};
					if (err.email) {
						$scope.errors['email'] = err.email;
						toastr.error($scope.errors['email'], {timeOut: 3000});
					}
					angular.forEach(err.errors, function(error, field) {
						form[field].$setValidity('database', false);
						$scope.errors[field] = error.message;
					});
				});
		}

		$scope.showforgot = function() {
			$scope.forgotChecked = !$scope.forgotChecked;
		}

		$scope.forgotPwd = function (userData) {
			Auth.forgot($scope.email)
				.then(function(data) {
					if(data.success) {
						toastr.success('Please check your email.', 'Success', {timeOut: 3000});
						$scope.forgotChecked = false;
					}
					else {
						toastr.error(data.msg, {timeOut: 3000});
					}
				})
				.catch(function(err) {
					err = err.data;
					toastr.error(err, 'Error', {timeOut: 3000});
				});
		}
	});