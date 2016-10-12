angular.module('starter').controller('MessagesCtrl', function ($scope, $state, $location) {

  $scope.goBack = function(){
    $state.go('challenge');
  }
  $scope.goMessage = function ($event) {
    $state.go('singleMessage');
  }


  $scope.allMessages = [{
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }, {
    avatar: '//1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png?s=30x30&f=t&cb=1',
    name: 'Tasin Akdeniz',
    newMessage: 'Hello Tasin, do you having a good day?'
  }];


})
