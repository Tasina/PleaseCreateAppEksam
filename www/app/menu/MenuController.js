angular.module('starter')

.controller('MenuCtrl', function($scope, $state, $localstorage, loadingService) {

    $scope.isAuthenticated = function(){
      return $localstorage.userIsAuthed();
    }

    $scope.goSettings = function(){
      loadingService.loaderShow();
      mixpanel.track("Menu-navigation: Settings");
      $state.go('editProfile');
      loadingService.loaderHide(2500);
    }

    $scope.goProfile = function(){
      loadingService.loaderShow();
      mixpanel.track("Menu-navigation: Profile");
      $state.go('myProfile');
      loadingService.loaderHide(2500);
    }

    $scope.goMessage = function(){
      mixpanel.track("Menu-navigation: Messages");
      $state.go('singleMessage');

    }

    $scope.goLogin = function(){
      $state.go('login');
    }

});

