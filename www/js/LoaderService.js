angular.module('starter')

.service('loadingService', function($ionicLoading, $timeout) {

  this.loaderShow = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
    });
  };
  this.simpleLoaderShow = function() {
    $ionicLoading.show({
      template: ''
    });
  };

  this.loaderShowLogin = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner> </br>Loggin in...'
    });
  };
  this.loaderHide = function(time) {
    $timeout(function() {
      $ionicLoading.hide();
    }, time | 0);
  };

});
