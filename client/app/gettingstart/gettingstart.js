'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.start',{
                url: 'getting-start',
                views: {
                    'content@':{
                        templateUrl: 'app/gettingstart/gettingstart.html',
                        controller: 'GettingstartCtrl'
                    }
                }
            })
        });
