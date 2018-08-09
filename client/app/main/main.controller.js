'use strict';

angular.module('namedropApp')
	.controller('MainCtrl', function ($scope,toastr,$location, $http,$state) {
		$scope.$on('$viewContentLoaded', function() {
			Reveal.init();
			Slider.init();
			Component.init();
			App.init();
		});
	});