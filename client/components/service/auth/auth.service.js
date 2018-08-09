'use strict';

angular.module('namedropApp')
    .factory('Auth', function Auth($location, $rootScope, $http, User, toastr, $cookieStore, $cookies, $q, $state) {
        if ($cookieStore.get('token')) {
            User.get(function(user) {
                if (user.email !== $rootScope.userEmail) {
                    $rootScope.userEmail = user.email;
                    $rootScope.user = user;
                    angular.forEach(user, function(val, index) {
                        if (typeof val != 'object')
                            $cookieStore.put(index, val);
                    });
                }
            }, function(err) {
                if (err.data == 'unauthorized') {
                    $rootScope.userEmail = undefined;
                    $rootScope.user = {};
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function(value, key) {
                        $cookieStore.remove(key);
                    });
                    $state.go('main.auth');
                }
            });
        }
        return {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            login: function(user, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();
                $http.post('/auth/local', user).
                    success(function(data) {
                        $cookieStore.put('token', data.token);
                        $http.defaults.headers.common.Token = data.token;
                        User.get(function(user) {
                            $rootScope.userEmail = user.email;
                            $rootScope.user = user;
                            angular.forEach(user, function(val, index) {
                                if (typeof val != 'object')
                                    $cookieStore.put(index, val);
                            });
                            deferred.resolve(data);
                            return cb();
                        });
                    }).
                    error(function(err) {
                        this.logout();
                        deferred.reject(err);
                        return cb(err);
                    }.bind(this));

                return deferred.promise;
            },

            /**
             * Delete access token and user info
             *
             * @param  {Function}
             */
            logout: function() {
                $rootScope.userEmail = undefined;
                $rootScope.user = {};
                var cookies = $cookies.getAll();
                angular.forEach(cookies, function(value, key) {
                    $cookieStore.remove(key);
                });
                toastr.clear();
                delete $rootScope.initialized;
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            createUser: function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(data) {
                        $cookieStore.put('token', data.token);
                        User.get(function(user) {
                            $rootScope.userEmail = user.email;
                            $rootScope.user = user;
                            angular.forEach(user, function(val, index) {
                                if (typeof val != 'object')
                                    $cookieStore.put(index, val);
                            });
                            return cb(user);
                        });
                    },
                    function(err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;
                var id = $cookieStore.get('id');

                return User.changePassword({ id: id }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(res) {
                    return cb(res);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            /**
             * Check if a user is logged in
             *
             * @return {Boolean}
             */
            isLoggedIn: function() {
                if ($cookieStore.get('id') && $cookieStore.get('token'))
                    return true;

                return false;
            },

            /**
             * Get auth token
             */
            getToken: function() {
                return $cookieStore.get('token');
            },

            /**
             * Forgot Password
             *
             * @param  {Object}   user
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            forgot: function(email, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();
                var server = 'http://ournameshop.com';
                $http.post(server + '/auth/forgot', {email: email}).
                    success(function(data) {
                        return cb(res);
                    }).
                    error(function(err) {
                        return cb(err);
                    }.bind(this));

                return deferred.promise;
            },

            /**
             * Change Info
             * @param  {Object}   user
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changeInfo: function(userInfo, callback) {
                var cb = callback || angular.noop;
                var id = $cookieStore.get('id');
                return User.updateInfo({ id: id }, userInfo,
                    function(user) {
                        return cb(false, user);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            /**
             * Change Key
             *
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changeKey: function(callback) {
                var cb = callback || angular.noop;
                var id = $cookieStore.get('id');

                return User.changeKey({ id: id }, {},
                    function(data) {
                        $cookieStore.put('apikey', data.key);
                        $rootScope.user.apikey = data.key;
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            }
        };
    });
