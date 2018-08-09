'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.auth',{
                url: 'login',
                views: {
                    'content@': {
                        templateUrl: 'app/user/auth.html',
                        controller: 'AuthCtrl'
                    }
                }
            })
    });
