/*angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $ionicPopup) {
  $scope.user = {
    username: '',
    password: ''
  }

  $scope.login = function(){
    console.log('LOGIN user: ' + $scope.user.username + ' Password: ' + $scope.user.password);

      loginService.loginUser($scope.user.username, $scope.user.password).success(function(data) {
            $state.go('new');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });

  }
})


.controller('HomeCtrl', function($scope, $state) {

/*
    var request = new XMLHttpRequest();
    var path="http://beta.pleasecreate.com/categories.json?api_key=c7d1d70af09b91b497afec35bd795b1602ac6fca824cbbf955840ac3ebe32fde";
    request.onreadystatechange=state_change;

    request.open("GET", path, true);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //request.setRequestHeader("User-Agent", "Mozilla/5.0");
    request.setRequestHeader("Accept","text/plain");
    request.setRequestHeader("Content-Type","text/plain");

    request.send(null);
        function state_change()
    {
    if (request.readyState==4)
      {// 4 = "loaded"
      if (request.status==200)
        {// 200 = OK
        // ...our code here...
        alert('ok');
        }
      else
        {
        alert("Problem retrieving XML data");
        }
      }
    }

    $scope.test = function(){
      console.log('hello');
      $state.go('login');
    };

})

.controller('NewCtrl', function($scope, $state) {

});

*/
