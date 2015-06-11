var userControllers = angular.module('userControllers', []);
userControllers
  .controller('UserController', function ($scope, User) {
    User.list(function(users) {
      $scope.users = users;
    });
  })
;

var userFactories = angular.module('userFactories', []);
userFactories
  .factory('User', function ($http) {
    return {
      list: function (cb) {
        $http({
          method: 'GET',
          url: '/users'
        }).success(cb);
      },
      find: function (id, cb) {
        $http({
          method: 'GET',
          url: '/users/' + id
        }).success(cb);
      }
    };
  })
;

var userDirectives = angular.module('userDirectives', []);
userDirectives
  .directive('userList', function () {
    return {
      scope: {
        users: '='
      },
      restrict: 'E',
      templateUrl: '/angular/users/list',
      replace: false,
      transclude: true
    };
  })
  .directive('userListItem', function () {
    return {
      require: '^userList',
      scope: {
        user: '='
      },
      restrict: 'E',
      templateUrl: '/angular/users/list-item',
      replace: true
    };
  })
  .directive('userListOptions', function () {
    return {
      require: '^userListItem',
      scope: {
        userId: '@'
      },
      restrict: 'E',
      templateUrl: '/angular/users/list-options',
      replace: true
    };
  })
;

var userModule = angular.module('userModule', [
  'userControllers',
  'userFactories',
  'userDirectives'
]);

var app = angular.module('appModule', [
  'ngRoute',
  'userModule'
]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/users', {
      templateUrl: '/angular/users/index',
      controller: 'UserController'
    })
    .otherwise({
      redirectTo: '/users'
    })
  ;
});

app.controller('AppController', function ($scope) {});


