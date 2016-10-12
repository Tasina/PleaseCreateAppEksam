angular.module('starter')

//NOTE: We are including the constant `ApiEndpoint` to be used here.
.factory('UserService', function($http, ApiEndpoint, $localstorage) {
  console.log('ApiEndpoint', ApiEndpoint)

  var getAllUsers = function(cb) {
    return $http.get(ApiEndpoint.url + 'admin/users.json')
      .then(function(data) {
        //console.log('Got some data(UserService - Get all users): ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting users: ', error);
      }
  }

  var getUserInformation = function(username, cb) {
    var token = $localstorage.get('user_token');
    return $http.get(ApiEndpoint.url + 'users/' + username + '.json', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        //console.log('Got some data(UserService - Get user information): ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting user information: ', error);
      }

  }

  var getUserSummary = function(username, cb) {
    var token = $localstorage.get('user_token');
    return $http.get(ApiEndpoint.url + 'users/' + username + '/summary.json', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        //console.log('Got some data(UserService -  Get user summary): ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting user summary: ', error);
      }
  }

  var updateUser = function(user, cb) {
    var token = $localstorage.get('user_token');
    return $http.put(ApiEndpoint.url + 'users/' + user.username, user, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).error(function(error) {
        cb(error);
      })
      .then(function(data) {
        //console.log('Got some data(UserService - Update user function): ', data);
        cb(data);
      })

  }

  var updateUsername = function(old, newUsername, cb) {
    var data = {
      new_username: newUsername
    }
    var old_username = $localstorage.get('user');
    var token = $localstorage.get('user_token');

    return $http.put(ApiEndpoint.url + 'users/' + old_username + '/preferences/username', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).error(function(error) {
        cb(error);
      })
      .then(function(data) {
        //console.log('NEW USERNAME DATA:  ', data);
        $localstorage.set('user', data.data.username);
        cb(data);
      }),
      function error(error) {
        console.log('Problem updating username: ', error);
      }
  }

  var updateEmail = function(newEmail, cb) {
    var data = {
      email: newEmail
    }
    var username = $localstorage.get('user');
    var token = $localstorage.get('user_token');

    return $http.put(ApiEndpoint.url + 'users/' + username + '/preferences/email', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .error(function(error) {
        cb(error);
      })

    .then(function(data) {
        //console.log('NEW EMAIL DATA:  ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem updating email: ', error);
      }
  }

  var resetPassword = function(cb) {
    var username = $localstorage.get('user');
    var token = $localstorage.get('user_token');
    var data = {
      login: username
    }

    return $http.post(ApiEndpoint.url + 'session/forgot_password', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).error(function(error) {
        cb(error);
      })
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem resetting password: ', error);
      }
  }


  //--------------------Search users ------------------------------------//

  var searchUsers = function(search_name, cb) {
    var token = $localstorage.get('user_token');
    return $http.get(ApiEndpoint.url + 'users/search/users?term=' + search_name + '&include_groups=false&include_mentionable_groups=true&topic_allowed_users=false', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem searching users: ', error);
      }
  }

  //---------------------notifications-------------------------------------
  var getUserNotifications = function(cb) {
    var token = $localstorage.get('user_token');
    var username = $localstorage.get('user');
    return $http.get(ApiEndpoint.url + 'notifications.json?username=' + username, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        //console.log('Got some Data(UserService - Get user notifications): ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting notifications for user: ', error);
      }

  }

  var getTopics = function(topicsId, cb) {
    return $http.get(ApiEndpoint.url + 't/' + topicsId + '.json')
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting topics for user: ', error);
      }
  }

  var getComment = function(postId, cb) {
    return $http.get(ApiEndpoint.url + 'posts/' + postId + '.json')
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting comments : ', error);
      }

  }

  /*
    var setNotificationRead = function(cb) {
      var token = $localstorage.get('user_token');
      return $http.put(ApiEndpoint.url + 'notifications/mark-read.json', {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(function(data) {
          console.log(data);
          cb(data);
        });
    }*/



  //-----------------Create User----------------------------//
  var createUser = function(user, cb) {
    $http.post(ApiEndpoint.url + 'users.json', user)
      .then(function(data) {
        //console.log('Got some data(UserService - Create user function): ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem creating user ', error);
      }

  }

  var checkUsername = function(username, cb) {

      return $http.get(ApiEndpoint.url + 'users/check_username?username=' + username, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(function(data) {
          //console.log('checkUsername', data);
          cb(data);
        }),
        function error(error) {
          console.log('Problem checking username: ', error);
        }
    }
    /*
      var checkEmail = function(email, cb) {
        return $http.get(ApiEndpoint.url + 'users/list/new&filter=' + email, {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          .then(function(data) {
            console.log('checkEmail: ', data);
            cb(data);
          });
      };
    */

  return {
    getAllUsers: getAllUsers,
    getUserInformation: getUserInformation,
    updateUser: updateUser,
    updateUsername: updateUsername,
    updateEmail: updateEmail,
    resetPassword: resetPassword,
    createUser: createUser,
    checkUsername: checkUsername,
    getUserNotifications: getUserNotifications,
    getComment: getComment,
    getTopics: getTopics,
    getUserSummary: getUserSummary
      //setNotificationRead: setNotificationRead
  };

})
