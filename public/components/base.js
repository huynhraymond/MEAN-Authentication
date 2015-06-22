
var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'myApp.authentication']);

myApp.run(function(AjaxServices, MsgServices) {
    AjaxServices.session().success(function(res) {
        MsgServices.setMsg(res);
    });
});

myApp.config( function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('/', {
            url: '/'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'components/authen/_login.html',
            controller: 'LoginController'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'components/authen/_register.html',
            controller: 'RegisterController'
        });
});

myApp.controller('MainController', function($scope, MsgServices, AjaxServices) {
    $scope.page = {};
    $scope.page.welcome = 'Welcome Guest';
    $scope.page.msg = '';

    $scope.loginUser = {};

    $scope.$watch(function() { return MsgServices.getMsg(); },
        function(newValue) {
            if ( newValue.msg )        // Got general msg
                $scope.page.msg = newValue.msg;
            else if ( newValue.username ) {   // Got authorized user
                $scope.page.msg = '';
                $scope.page.welcome = 'Welcome ' + newValue.username.toUpperCase();
                $scope.loginUser = newValue;
            }
        });

    $scope.logout = function() {
        AjaxServices.logout().success(function() {
            $scope.loginUser = {};
            $scope.page.welcome = 'Welcome Guest';
        });
    };

    // Listen for broadcast
    /*
    $scope.$on('internal_msg', function() {
        var data = BroadCast.receiveData();

        // Page general msg
        if ( data.msg ) $scope.page.msg = data.msg;
        else  {
            $scope.page.welcome = 'Welcome ' + data.username.toUpperCase();
            $scope.page.msg = '';
        }
        //$scope.page.welcome = 'Welcome ' + user.username;
    });
    */
});

// This is a factory function that will return a service (singleton object)
myApp.factory('AjaxServices', function($http) {
    return {
        register: function (user) {
            return $http.post('/access/register', user);
        },

        login: function (user) {
            return $http.post('/access/login', user);
        },

        logout: function() {
            return $http.get('/access/logout');
        },

        validate: function(data) {
            return $http.post('/access/validate', data);
        },

        session: function() {
            return $http.get('/access/session');
        }
    }
});

myApp.factory('MsgServices', function() {
    var msg = {};

    return {
        getMsg: function() {
            return msg;
        },

        setMsg: function(data) {
            msg = data;
        }
    }
});

myApp.factory('BroadCast', function($rootScope) {
    var service = {};
    service.data = {};

    service.sendData = function(data) {
        this.data = data;

        $rootScope.$broadcast('internal_msg')
    };

    service.receiveData = function() {
        return this.data;
    };

    return service;
});

