angular.module('starter')

.controller('ProfileCtrl', function($scope, $state, UserService, $ionicPopup, $localstorage, LoginService, ApiEndpoint, $ionicHistory, loadingService, ionicToast, $document, $timeout, RequestService) {
  var noti = [];
  $scope.shownNotification = [];
  var count = 0;
  $scope.noData = true;

  $scope.$on('$ionicView.enter', function(e) {
    loadingService.loaderShow();
    loadData();
    loadingService.loaderHide(1500);
  })

  var loadData = function() {
    myUsername = $localstorage.get('user');
    //UserInformation----------------------------------------------------------
    UserService.getUserInformation(myUsername, function(data) {
      $scope.loggedInUser = data.data.user;
      $scope.loggedInUser.myAvatar = setAvatar();
    });
    UserService.getUserSummary(myUsername, function(data) {
      $scope.userSummary = data.data.user_summary;
    });

    //notifications & posts-----------------------------------------------
    UserService.getUserNotifications(function(data) {
      $scope.notifications = data.data.notifications;
      $scope.notifications.forEach(function(n) {
        console.log('GET PROFILE NODATA = FALSE');
      })
      $scope.loadMoreData();
      $scope.nodata = false;

    });
  }

  $scope.RefreshProfile = function() {
    console.log('Refresing Profile');
    $scope.shownNotification = [];
    count = 0;
    loadData();
    setTimeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }

  $scope.loadMoreData = function() {
    if ($scope.notifications) {
      console.log('LOADMOREDATA');
      pushNotification(count);
      pushNotification(count + 1);
      count += 2;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  function pushNotification(index) {
    var x = $scope.notifications[index];
    if (x) {
      if (x.data.original_post_id == null) {
        //console.log('original_post_id is null');
      } else {
        if (x.notification_type != 4 && x.notification_type != 6) {
          //console.log(x);
          x.created_at_orginal = Date.parse(x.created_at);

          /////////////////sets the since time and text/////////////////////
          //////////////////////////////////////////////////////////////////
          var time = Date.parse(x.created_at);
          var today = Date.parse(new Date());
          // get total seconds between the times
          var delta = Math.abs(time - today) / 1000;
          var days = Math.floor(delta / 86400);
          delta -= days * 86400;
          var hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;
          var minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;
          var seconds = delta % 60;

          //sets Days
          x.created_at = days;
          x.days = days;
          x.sinceText = 'Days ago';
          //sets Hours
          if (x.created_at == 0) {
            x.created_at = hours;
            x.hours = hours;
            x.sinceText = 'Hours ago';
            //sets minuts
            if (x.created_at == 0) {
              x.created_at = minutes;
              x.minutes = minutes;
              x.sinceText = 'Minutes ago';
              //sets seconds
              if (x.created_at == 0) {
                x.created_at = seconds;
                x.seconds = seconds;
                x.sinceText = 'Seconds ago'
              }
            }
          }

          UserService.getTopics(x.topic_id, function(data) {
            if (data.data.user_id == $scope.loggedInUser.id) {
              x.topicsdata = data.data;
              x.topicsdata.posts_count -= 1;
              $scope.shownNotification.push(x);
              //Sort Array
              $scope.shownNotification.sort(function(a, b) {
                return b.created_at_orginal - a.created_at_orginal;
              });
            }
          });
        }
      }
    } else {
      console.log('NODATA = TRUE (PUSH)');
      $scope.nodata = true;
    }

  }

  var setAvatar = function() {
    var userAvatar = $scope.loggedInUser.avatar_template;
    if (userAvatar.substring(0, 1) == "/") {
      var newAvatar = ApiEndpoint.url2 + userAvatar;
      return newAvatar.replace("{size}", "100");
    } else {
      return userAvatar.replace("{size}", "100");
    }
  }

  //Sets the background color if notification is read or not.
  $scope.notificationIsRead = function() {
    var element = $('#notificationRead');
    if (noti.read == false) {
      element.removeClass('sitem');
      element.addClass('sitemRead');
    } else {
      element.removeClass('sitemRead');
      element.addClass('sitem');
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //-------------------------Sets notification icon---------------------------//
  //////////////////////////////////////////////////////////////////////////////
  //if notification is like
  $scope.isLike = function(noti) {
      if (noti.notification_type == 5) {
        noti.textToPast = 'liked your idea';
        return true;
      }
      return false;
    }
    //if notification is comment
  $scope.isComment = function(noti) {
      if (noti.notification_type == 9 && !/^[a-zA-Z]+$/.test(noti.data.display_username) && noti.notification_type != 5) {
        noti.textToPast = 'comment your idea';
        return true;
      }
      return false;
    }
    //if notification is idea
  $scope.isIdea = function(noti) {
    if (noti.notification_type == 9 && /^[a-zA-Z]+$/.test(noti.data.display_username) && noti.notification_type != 5) {
      noti.textToPast = 'made an idea ';
      return false;
    }
    return true;
  }

  //////////////////////////////////////////////////////////////////////////////
  //----------------------------- Something else -----------------------------//
  //////////////////////////////////////////////////////////////////////////////
  $scope.historyBack = function() {
    console.log('clicked;');
    $ionicHistory.goBack(-2);
  }

  $scope.goChallenges = function() {
    $state.go('challenge');
  }

  $scope.goToIdea = function(selectedId) {
    loadingService.loaderShow();
    loadingService.loaderHide(700);
    mixpanel.track("My profile: Notification clicked");
    $state.go('idea', {
      id: selectedId
    });
    /*
        console.log(noti.read);
          UserService.setNotificationRead(function(data) {
            console.log(data);
          });*/

  }

  $scope.showGiven = function() {
    ionicToast.show('Not functional yet', 'center', false, 2500);
  }

  $scope.showRecieved = function() {
    ionicToast.show('Not functional yet', 'center', false, 2500);
  }

  $scope.showSignout = function() {
    console.log($localstorage.get('user_token'));
    console.log($localstorage.get('user'));
    var importPopup = $ionicPopup.show({
      title: 'Would you like to sign out?',
      scope: $scope,
      cssClass: "popup-import",
      buttons: [{
          type: 'ion-close-circled'
        },

        {
          type: 'ion-checkmark-circled',
          onTap: function(e) {
            LoginService.userLogout(function(data) {

              mixpanel.track("Sign out");
              RequestService.unregister();
              $state.go('challenge');
            });
          }
        }
      ]
    });
  };


});
