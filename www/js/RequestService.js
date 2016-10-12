angular.module('starter')

.factory('RequestService', function($http, $q, $ionicLoading, $localstorage, $window, UserService) {

  var base_url = 'https://pc-busterkaas.rhcloud.com/api/gcm/';
  var device_token;
/*
  FCMPlugin.getToken(function(token) {
    $window.localStorage['device_token'] = token;
    device_token = token;
  })
*/
  function register() {

    var username = $localstorage.get('user');
    username = username.toLowerCase();
    if (!tokenExists(username)) {

      var lastNotification = {};
      var platform = '';

      if (ionic.Platform.isIOS()) {
        platform = 'ios';
      } else if (ionic.Platform.isAndroid()) {
        platform = 'android';
      } else {
        platform = 'unknown';
      }

      UserService.getUserNotifications(function(cb) {
        if (cb.data.notifications.length > 0) {
          lastNotification = cb.data.notifications[0];
        }
        $http.post(base_url, {
            'name': username,
            'deviceToken': device_token,
            'platform': platform,
            'lastNotification': lastNotification
          })
          .success(function(response) {
            console.log(response);
          })
          .error(function(data) {
            console.log('Error create push user:', data);
          });
      })
    }
    console.log('User already exists with this device token!');
  }

  function tokenExists(username) {
    $http.get(base_url, {
        token: device_token
      })
      .success(function(response) {
        console.log(response);
        if (response[0]) {
          if (response[0].name.toLowerCase() == username.toLowerCase()) {
            return true;
          }
        }
        return false;
      })
      .error(function(data) {
        console.log('Error:', data);
      });
  }

  function unregister() {
    $http.delete(base_url, {
        token: device_token
      }).success(function(response) {
        console.log('success:', response);
      })
      .error(function(data) {
        console.log('Error unregister:', data);
      });
  }

  return {
    register: register,
    unregister: unregister
  };
})
