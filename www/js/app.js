// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic-toast', 'ngCordova', 'ionic.ion.imageCacheFactory'])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
})


.run(function($ionicPlatform, $rootScope, $window, LoginService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      LoginService.userReLogin();
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }


    navigator.splashscreen.show();
    window.setTimeout(function() {
      navigator.splashscreen.hide();
    }, 3500 - 2000);

    FCMPlugin.getToken(function(token) {
      $window.localStorage['device_token'] = token;
    })

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    $ionicPlatform.on('resume', function() {
      LoginService.userReLogin();
    });
  })

  window.errorHandler = function(error) {
    console.log('an error occured' + error);
  }


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.scrolling.jsScrolling(false);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('login', {
    url: '/login',
    templateUrl: 'app/login/login.html',
    controller: 'LoginCtrl',
    cache: false

  })

  .state('createAcc', {
    url: '/createAccount',
    templateUrl: 'app/login/create-account.html',
    controller: 'CreateAccCtrl',
    cache: false

  })

  .state('forgotAcc', {
    url: '/forgotAccount',
    templateUrl: 'app/login/forgot-account.html',
    controller: 'ForgotAccCtrl',
    cache: false

  })

  .state('challenge', {
    url: '/',
    templateUrl: 'app/challenge/challenge.html',
    controller: 'ChallengeCtrl'
  })

  .state('introduktion', {
    url: '/introduktion',
    templateUrl: 'app/introduktion.html',
    cache: false

  })

  .state('message', {
    url: '/messages',
    templateUrl: 'app/message/message.html',
    controller: 'MessagesCtrl',

  })

  .state('singleMessage', {
    url: '/singleMessage',
    templateUrl: 'app/message/single-message.html',
    controller: 'SingleMsgCtrl',

  })

  .state('myProfile', {
    url: '/myProfile',
    templateUrl: 'app/profile/profile.html',
    controller: 'ProfileCtrl',
    cache: false

  })

  .state('editProfile', {
    url: '/editProfile',
    templateUrl: 'app/profile/edit-profile.html',
    controller: 'EditProfileCtrl',
    cache: false
  })

  .state('user', {
    url: '/user',
    templateUrl: 'app/user/user.html',
    cache: false

  })

  .state('challenge-details', {
    url: '/challenge-details',
    abstract: true,
    templateUrl: 'app/challenge-details/challenge-tab.html',
    controller: 'ChallengeDetailsCtrl',
    cache: false
  })

  .state('challenge-details.images', {
    url: '/images',
    views: {
      'tab-images': {
        templateUrl: 'app/challenge-details/challenge-images.html',
        controller: 'ChallengeDetailsImagesCtrl'
      }
    },
    cache: false
  })

  .state('challenge-details.details', {
    url: '/details',
    views: {
      'tab-details': {
        templateUrl: 'app/challenge-details/challenge-details.html',
        controller: 'ChallengeDetailsCtrl'
      }
    },
    cache: false
  })

  .state('challenge-details.ideas', {
    url: '/ideas',
    views: {
      'tab-ideas': {
        templateUrl: 'app/challenge-details/challenge-ideas.html',
        controller: 'ChallengeDetailsCtrl'
      }
    },
    cache: false
  })

  .state('idea', {
    url: '/idea/{id}',
    templateUrl: 'app/idea/idea.html',
    controller: 'IdeaCtrl',
    cache: false

  })

  .state('new-idea', {
    url: '/new-idea/{id}',
    templateUrl: 'app/idea/create-idea.html',
    controller: 'NewIdeaCtrl',
    cashe: false
  })

  .state('mockUp-createAccount', {
    url: '/mockUp-createAccount',
    templateUrl: 'app/mock-up/mockUp-createAccount.html',
    cashe: false
  })

  .state('mockUp-profile', {
    url: '/mockUp-profile',
    templateUrl: 'app/mock-up/mockUp-profile.html',
    cashe: false
  })

  .state('mockUp-challenge', {
    url: '/mockUp-challenge',
    templateUrl: 'app/mock-up/mockUp-challenge.html',
    cashe: false
  })

  .state('mockUp-challengeDetails', {
    url: '/mockUp-challengeDetails',
    templateUrl: 'app/mock-up/mockUp-challengeDetails.html',
    cashe: false
  })

  $urlRouterProvider.otherwise('/');

})

.directive("challengeTop", function() {
  return {
    restrict: 'AE',
    templateUrl: 'app/challenge-details/challenge-top.html',
    replace: false,
  }
})

.directive("popMenu", function() {
  return {
    restrict: 'AE',
    templateUrl: 'app/menu/menu.html',
    replace: false,
    controller: 'MenuCtrl'
  }
})

.constant('ApiEndpoint', {
  url: 'http://localhost:8100/api/',
  url2: 'http://localhost:8100/api'
    /*
  url:'http://beta.pleasecreate.com/',
  url2: 'http://beta.pleasecreate.com'
*/
});
