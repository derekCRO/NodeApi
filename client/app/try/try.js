'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.try',{
                url: 'try',
                views: {
                    'content@':{
                        templateUrl: 'app/try/try.html',
                        controller: 'TryCtrl'
                    }
                }
            })
    });
