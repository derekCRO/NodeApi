'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.docs',{
                url: 'docs',
                views: {
                    'content@':{
                        templateUrl: 'app/docs/docs.html',
                        controller: 'DocCtrl'
                    }
                }
            })
    });
  