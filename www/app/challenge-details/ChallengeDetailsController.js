angular.module('starter')

.controller('ChallengeDetailsCtrl', function($scope, $ionicViewSwitcher, $state, selectedChallenge, $ionicTabsDelegate, ChallengeService, ionicToast, loadingService, ApiEndpoint, $localstorage) {

  /*----------------- challenge details -------------------- */

  $scope.challenge = selectedChallenge.getChallenge();
  console.log($scope.challenge);

  /*--- This method is called everytime we enter this controller ---*/
  $scope.$on('$ionicView.enter', function(e) {
    $scope.challenge = selectedChallenge.getChallenge();
    addChallengeIdeas($scope.challenge);

  })

  function addChallengeIdeas(c) {
    ChallengeService.getIdeas(c.slug, function(data) {
      c.Ideas = data.data.topic_list.topics;
      c.Ideas.splice(0, 1);
      c.Ideas.forEach(function(idea) {
        idea.image_url = setImageUrl(idea.image_url);
      })
    });
  }



  var setImageUrl = function(url) {
    try {
      if (!url) {
        return 'img/background2.png';
      }
      if (url.substring(0, 1) == "/") {
        return ApiEndpoint.url2 + url;
      } else {
        return url;
      }
    } catch (exception) {
      console.log('new error images of my idea', exception);
    }
  }

  /*------------- challenge images -----------------*/
  /*
    var setImageUrl = function(url) {
        if (url.substring(0, 1) == "/") {
          return ApiEndpoint.url2 + url;
        }
        return url;
      }
    */

  /*------------------- State navigation -----------------*/
  $scope.back = function() {
    $ionicViewSwitcher.nextTransition('none');
    loadingService.simpleLoaderShow();
    $state.go('challenge');
    loadingService.loaderHide(500);
  }

  $scope.createIdea = function() {
    if (!$localstorage.userIsAuthed()) {
      ionicToast.show('You have to be logged in, to add a new idea!', 'center', false, 2500);
    } else if ($scope.challenge.challengeDaysToFinish < 0) {
      ionicToast.show('This challenges has ended and will not accept new ideas!', 'center', false, 2500);
    } else {
      $state.go('new-idea', {
        id: $scope.challenge.id
      });
    }
  }

  $scope.goToIdea = function(idea) {
    loadingService.loaderShow();
    loadingService.loaderHide(700);
    $state.go('idea', {
      id: idea.id
    });
  }
  $scope.goToMain = function(challenge) {
    loadingService.simpleLoaderShow();
    mixpanel.track("User navigated to challenge page");

    $state.go('challenge');
    loadingService.loaderHide(500);
  }


  /*---------- Detail click Navigation -------------- */
  $scope.navDescription = function() {
    mixpanel.track("Challenge-Navigation-Click: Description");
    $state.go('challenge-details.details');
  }
  $scope.navGallery = function() {
    mixpanel.track("Challenge-Navigation-Click: Gallery");
    $state.go('challenge-details.images');
  }
  $scope.navIdeas = function() {
    mixpanel.track("Challenge-Navigation-Click: Ideas");
    $state.go('challenge-details.ideas');
  }

  /*---------- Detail tab Navigation ---------------- */
  $scope.goForward = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) {
      $ionicTabsDelegate.select(selected + 1);
      //mixpanel.track("Challenge-Navigation-Swipe: Right");
    }
  }

  $scope.goBack = function() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1 && selected != 0) {
      $ionicTabsDelegate.select(selected - 1);
      //.track("Challenge-Navigation-Swipe: Left");
    }
  }

  $scope.goToIdea = function(selectedId) {
    loadingService.loaderShow();
    loadingService.loaderHide(700);
    $state.go('idea', {
      id: selectedId
    });
  }

})
