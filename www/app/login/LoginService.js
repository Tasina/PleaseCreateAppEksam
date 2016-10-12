angular.module('starter')

//NOTE: We are including the constant `ApiEndpoint` to be used here.
.factory('LoginService', function($http, ApiEndpoint, $localstorage, $ionicHistory, $window) {



  var userLogin = function(loginForm, cb) {
    var date = new Date();
    timeStamp = Date.parse(date);
    var csrf;

    /*console.log('getting token');*/
    $http.get(ApiEndpoint.url + 'session/csrf?_=' + timeStamp, {
        headers: {
          'x-csrd-token': 'undefined',
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        csrf = data.data.csrf;
        $http.post(ApiEndpoint.url + 'session', loginForm, {
            headers: {
              'content-type': 'application/json',
              'x-csrf-token': csrf,
              'x-requested-with': 'XMLHttpRequest'
            }
          })
          .then(function(user) {
            try {
              $localstorage.set('user', loginForm.login);
              $localstorage.set('user_pw', loginForm.password);
              $localstorage.set('user_token', csrf);
            } catch (e) {
              console.log('error in userservice: login ', e);
            }
            cb(user);
          }),
          function errorCallback(response) {
            console.log('errorCallback in login:', response);
          }
      }),
      function errorCallback(response) {
        console.log('errorCallback in login:', response);
      }
  }

  var userReLogin = function() {
    if($localstorage.userIsAuthed()){
      var login = {
        login: $localstorage.get('user'),
        password: $localstorage.get('user_pw')
      }
      userLogin(login, function(cb){
        console.log('token refresh complete', cb);
      })
    }
    else{
      console.log('no user saved on phone');
    }
  }

  var userLogout = function(cb) {
    var username = $localstorage.get('user');
    var token = $localstorage.get('user_token');
    $http.delete(ApiEndpoint.url + 'session/' + username, {
        headers: {
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        $localstorage.clearStorage();
        console.log('Storage cleared!');
        cb(data);
      }),
      function errorCallback(response) {
        console.log('errorCallback in logout:', response);
      }
  }

  return {
    userLogin: userLogin,
    userLogout: userLogout,
     userReLogin: userReLogin
  };

})
