
var app = angular.module('myApp.authentication', ['myApp']);

app.controller('LoginController', function($scope, AjaxServices, MsgServices, $state) {
    $scope.login = {};
    //var link = document.querySelector('#login');
    //link.textContent = (link.textContent === 'Login') ? 'Logout' : 'Login';

    $scope.verify = function() {
        AjaxServices.login($scope.login).success(function (res) {
            //console.log(res);
            //$rootScope.welcome = 'Welcome ' + $scope.login.username;
            //BroadCast.sendData(res);
            MsgServices.setMsg(res);

            $state.go('/');

        }).error(function() {
            //BroadCast.sendData({msg: messages.login.failure});
            MsgServices.setMsg({msg: messages.login.failure});

            return;
        });
    };

    $scope.cancel = function() {
        //console.log('Login: ', $state.$current);
        //MsgServices.setMsg({msg: 'Check State'});
        console.log('State: ', $state.current.data);
        $state.go('/');
    }
});

app.controller('RegisterController', function($scope, AjaxServices, MsgServices, $state) {
    // Ensure the user validate his/her email and phone first
    setRegisterValid(false);

    $scope.registeredUser = {};
    $scope.registeredUser.username = '';
    $scope.registeredUser.password = '';

    // Send email out to provided phone and email address to validate user's identity
    $scope.validate = function() {

        $scope.registeredUser.tel = $scope.registeredUser.tel.replace(/[^\d]/g, ''); // 4086009999
        if ( $scope.registeredUser.tel.length < 10 ) {
            MsgServices.setMsg({msg: messages.signup.phone});

            return;
        }

        if ( !$scope.registeredUser.email.indexOf('@') || !$scope.registeredUser.email.indexOf('.') ) {
            MsgServices.setMsg({msg: messages.signup.email});

            return;
        }

        $scope.validationId = uuid();
        var obj = { tel: $scope.registeredUser.tel,
            email: $scope.registeredUser.email,
            id: $scope.validationId };

        AjaxServices.validate(obj).success(function(res) {
            console.log(res);
            //BroadCast.sendData({msg: messages.signup.post_validate});
            MsgServices.setMsg({msg: messages.signup.post_validate});
            setRegisterValid(true);
        });
    };

    $scope.register = function() {
        //$scope.validationId = "5e1e536a-dea4-4bb9-be81-bc648328bb87";
        //console.log($scope.registeredUser);
        var msg = isRegisterValid($scope.registeredUser, $scope.validationId);

        // Form Registration Error
        if ( msg.length > 0 ) {
            MsgServices.setMsg({msg: msg});
            return;
        }

        AjaxServices.register($scope.registeredUser).success(function() {
            MsgServices.setMsg({msg: messages.signup.success});

            // Redirect to login page
            $state.go('login');

        }).error( function(err) {
            console.log(err);
            MsgServices.setMsg({msg: err.message});
            return;
        });
    };

    $scope.cancel = function() {
        $state.go('/');
    }
});

function isRegisterValid(obj, id) {
    if (obj.id !== id) {
        return messages.signup.passcode;
    }

    // check for empty inputs or minimum of 4 characters long
    for ( var prop in obj ) {
        if ( obj[prop].length <= 3 ) return messages.signup.min;
    }

    // check for matching password
    if ( obj.password !== obj.password_confirm ) return messages.signup.password;

    return '';
}

function setRegisterValid( boolean ) {
    var isValid = boolean || false;
    var valid = isValid ? 'inline-block' : 'none';
    var invalid = isValid ? 'none' : 'inline-block';
    var elements = document.querySelector('section.registration').querySelectorAll('input, button');

    for ( var i = 0, len = elements.length; i < len; i++ ) {
        if ( elements[i].classList.contains('validate') ) {
            if ( elements[i].tagName === 'BUTTON' ) elements[i].style.display = invalid;
            else elements[i].disabled = isValid;
        }

        else {
            if ( elements[i].tagName === 'BUTTON' ) elements[i].style.display = valid;
            else elements[i].disabled = !isValid;
        }
    }
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

var messages = {
    login: {
        login: 'Please provide username and password',
        success: 'Login success - Access grant',
        failure: 'Fail to login - Please try again'
    },

    logout: 'Logout success - Thank you for visiting our website',

    signup: {
        empty: 'Field(s) cannot be emptied - Required',
        min: 'Fields must contain minimum of 4 characters/digits',
        pre_validate: 'Please provide your phone and email to validate',
        post_validate: 'Please check your text or email for Validation id - Passcode',
        phone: 'Invalid telephone number',
        email: 'Invalid email address',
        password: 'Passwords are NOT matching',
        passcode: 'Invalid Validation id - Passcode Error',
        success: 'Register success - please login',
        failure: 'Register failure - please try again'
    }
};