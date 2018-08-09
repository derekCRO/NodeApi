'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.profile',{
                url: 'profile',
                views: {
                    'content@':{
                        templateUrl: 'app/profile/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
    });
  