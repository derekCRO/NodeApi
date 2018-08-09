'use strict';

angular.module('namedropApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('forum',{
                url: '/forum',
                views: {
                    'content':{
                        templateUrl: 'app/forum/forum.html',
                        controller: 'ForumCtrl'
                    }
                }
            })
    });
