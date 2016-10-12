angular.module('starter')

.controller('EditProfileCtrl', function($scope, $state, UserService, $ionicPopup, $localstorage, loadingService, ionicToast) {

  $scope.$on('$ionicView.enter', function(e) {
    loadingService.loaderShow();
    var myUsername = $localstorage.get('user');
    //UserInformation----------------------------------------------------------
    UserService.getUserInformation(myUsername, function(data) {
      $scope.loggedInUser = data.data.user;

      $scope.setAvatar = function() {
        var userAvatar = $scope.loggedInUser.avatar_template;
        if (userAvatar.substring(0, 1) == "/") {
          var newAvatar = 'http://beta.pleasecreate.com/' + userAvatar;
          return newAvatar.replace("{size}", "100");
        } else {
          return userAvatar.replace("{size}", "100");
        }
      }
    });
    loadingService.loaderHide(1500);
  })

  $scope.updateUser = function() {
    if ($scope.loggedInUser.name.length < 1) {
      ionicToast.show('You need to fill out your name', 'center', false, 2500);
    } else {
      UserService.updateUser($scope.loggedInUser, function(data) {
        if (data.errors) {
          ionicToast.show(data.errors[0], 'center', false, 2500);
        } else {
          ionicToast.show('Your information has been saved.', 'center', false, 2500);
          mixpanel.track("Edit profile: Update user-information");
        }
      })
    }
  }

  $scope.historyBack = function() {
    $state.go('challenge');
  }

  // Triggered on a button click, or some other target
  $scope.changeUsername = function() {
    var oldUsername = $scope.loggedInUser.username;
    ionicToast.show('Username is NOT editable on mobile application. Please visit our homepage or contact one of the administrators', 'center', false, 4500);
    /*
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="loggedInUser.username">',
      title: 'Enter new username',
      subTitle: 'WARNING: If you change your username, all prior quotes of your posts and @name mentions will be broken!',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (oldUsername === $scope.loggedInUser.username) {
            console.log('You already own that username, fool!');
            myPopup.close();
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            checkUsername(function(response) {
              if (response) {
                console.log('username is available!');
                UserService.updateUsername(oldUsername, $scope.loggedInUser.username, function(cb) {
                  mixpanel.track("Edit profile: Update username");
                  console.log(cb);
                })
              } else {
                console.log('username is NOT available');
                $scope.loggedInUser.username = oldUsername;
              }
            })
          }
        }
      }]
    });

    myPopup.then(function(res) {
      //console.log('Tapped!', res);
    });

    */
  }

  var checkUsername = function(cb) {
    var newUsername = $scope.loggedInUser.username;
    UserService.checkUsername(newUsername, function(data) {
      cb(data.data.available);
    });
  }

  $scope.changeEmail = function() {
    var oldEmail = $scope.loggedInUser.email;

    var myPopup = $ionicPopup.show({
      template: '<input type="email" ng-model="loggedInUser.email">',
      title: 'Enter new email',
      subTitle: 'NOTE: Email will be sent to your chosen mail with further instructions',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e){
          $scope.loggedInUser.email = oldEmail;
        }
      }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (validateEmail($scope.loggedInUser.email)) {
            UserService.updateEmail($scope.loggedInUser.email, function(cb) {
              if (cb.errors) {
                ionicToast.show(cb.errors[0], 'center', false, 3500);
              } else {
                ionicToast.show('Email changed. You will still need to confirm this, from your former email', 'center', false, 2500);
                mixpanel.track("Edit profile: email updated");

              }
            })
          } else {
            ionicToast.show('Please enter valid email', 'center', false, 2500);
            e.preventDefault();
          }
        }
      }]
    });


  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  $scope.resetPassword = function() {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Reset Password',
      subTitle: 'NOTE: You will recieve an email with instructions',
      template: 'Are you sure you want to reset your password?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        //console.log('You are sure');
        UserService.resetPassword(function(cb) {
          mixpanel.track("Edit profile: reset password");
          ionicToast.show('A password-reset mail has been sent to your e-mail', 'center', false, 2500);
          //console.log('Password reset cb:', cb);
        })
      } else {}
    });
  }


});
