angular.module('starter')


.controller('LoginCtrl', function($scope, $state, LoginService, RequestService, loadingService, $ionicHistory) {


  $scope.loginForm = {
    login: '',
    password: '',
    redirect: '/'
  }

  $scope.loginError = '';

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.goToChallenge = function() {
    $state.go('challenge');
  }

  $scope.login = function() {

    loadingService.loaderShowLogin();
    mixpanel.track("Login performed");
    if ($scope.loginForm.login.length > 1 && $scope.loginForm.password.length > 1) {
      LoginService.userLogin($scope.loginForm, function(data) {
        if (data.data.error) {
          $scope.loginError = data.data.error;
        } else {
          //Deliver your device token to middleman-server

          RequestService.register();

          //notifi mixpanel
          mixpanel.identify(data.data.user.username);
          mixpanel.people.set({
            "$email": data.data.user.email, // only special properties need the $
            "$last_login": new Date(), // properties can be dates...
            //  "gender": "Male" // feel free to define your own properties
          });
          console.log('logged in user:', data.data.user);

          $state.go('challenge');

        }
      });
    } else {
      $scope.loginError = 'Please enter valid data!'
    }

    loadingService.loaderHide(500);
  }

  $scope.forgotPassword = function() {
    $state.go('forgotAcc');
  }

  $scope.newMember = function() {
    $state.go('createAcc');
  }


})

.controller('CreateAccountCtrl', function($scope, $state, $ionicPopup, $document, $timeout, UserService) {
  $scope.back = function() {
    $state.go('login');
  }
  $scope.newUser = {
    name: '',
    username: '',
    password: '',
    password2: '',
    email: ''
  }

  $scope.errorMessage = '';



  $scope.createUser = function() {
    $scope.errorMessage = '';
    isValid();




  }

  function isValid() {
    if ($scope.newUser.name.length > 0 && $scope.newUser.username.length > 0 && $scope.newUser.password.length > 0 && $scope.newUser.password2.length > 0 && $scope.newUser.email.length > 0) {
      var usernameCheck = $scope.newUser.username;
      UserService.checkUsername(usernameCheck, function(d) {
        if (d.data.available) {
          console.log('checking');
          if (checkPassword()) {
            if (validateEmail($scope.newUser.email)) {
              $scope.errorMessage = 'valid';
              showAlert();
              UserService.createUser($scope.newUser, function(d) {
                console.log(d);
                mixpanel.track("User succesfully created");
                $state.go('login');
              });
            } else {
              $scope.errorMessage = 'Email is invalid!';
            }

          }
        } else {

          $scope.errorMessage = 'Username already exists';

        }
      });
    } else {
      $scope.errorMessage = 'Please enter valid data';

    }
  }


  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }




  var checkPassword = function() {
    console.log('running');
    var pass1 = $scope.newUser.password;
    var pass2 = $scope.newUser.password2;

    if (pass1 != pass2) {
      $scope.errorMessage = 'Passwords dosn´t match';
      return false;
    } else if (pass1.length < 8) {
      $scope.errorMessage = 'Password length has to be min. 8 characters';
      return false;
    }
    return true;

  }

  $scope.goBack = function() {
    $state.go('login');
  }

  $scope.goChallenges = function() {
    $state.go('challenges');
  }

  var showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Account Created',
      template: 'Verify your email!',
      cssClass: 'create_popup'
    });
  }


})

.controller('ForgotAccCtrl', function($scope, $state, UserService) {
  $scope.back = function() {
    $state.go('login');
  }

  $scope.forgotAccountClicked = function() {
    mixpanel.track("User forgot account");
  }


})
