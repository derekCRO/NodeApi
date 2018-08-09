'use strict';

var myApp = angular.module('namedropApp', [
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'infinite-scroll',
        'updateMeta',
        'toastr'
    ])
    .config(function($urlRouterProvider, $stateProvider, $routeProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push(function($q, $cookieStore) {
            return {
                'request': function(config) {
                    config.headers.Token = $cookieStore.get('token');
                    return config;
                }
            };
        });
    })
    .run(['$rootScope', 'Auth', 'toastr', '$state', '$http',
        function($rootScope, Auth, toastr, $state, $http) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                var normalRoutes = ['main', 'forum', 'main.docs', 'main.auth', 'main.start', 'main.try'];
                var restrictedRoutes = [];
                if (!Auth.isLoggedIn() && $.inArray(toState.name, normalRoutes) == -1) {
                    event.preventDefault();
                    $state.transitionTo('main');
                }
                if (Auth.isLoggedIn() && toState.name == 'main.auth') {
                    event.preventDefault();
                    $state.transitionTo('main.profile');
                }
            });
        }
    ]);
