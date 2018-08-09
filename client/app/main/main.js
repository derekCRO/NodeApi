'use strict';

angular.module('namedropApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('main',{
				url: '/',
				views: {
					'navbar': {
						templateUrl: 'components/navbar/navbar.html',
						controller: 'NavbarCtrl'
					},
					'content':{
						templateUrl: 'app/main/main.html',
						controller: 'MainCtrl'
					},
					'footer': {
						templateUrl: 'components/footer/footer.html',
						controller: 'FooterCtrl'
					},
				}
			})
	});
