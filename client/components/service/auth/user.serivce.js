'use strict';

angular.module('namedropApp')
    .factory('User', function($resource) {
        return $resource(
            '/users/:id/:controller', {
                id: '@_id'
            }, {
                changePassword: {
                    method: 'PUT',
                    params: {
                        controller: 'password'
                    }
                },
                updateInfo: {
                    method: 'PUT',
                    params: {
                        controller: 'update'
                    }
                },
                get: {
                    method: 'GET',
                    params: {
                        id: 'me'
                    }
                },
                createUser: {
                    method: 'PUT',
                    params: {
                        controller: 'create'
                    }
                },
                changeKey: {
                    method: 'PUT',
                    params: {
                        controller: 'key'
                    }
                },
                forgot: {
                    method: 'POST',
                    params: {
                        id: 'forgot'
                    }
                }
            });
    });
