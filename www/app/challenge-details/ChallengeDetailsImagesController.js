angular.module('starter')

.controller('ChallengeDetailsImagesCtrl', function($scope, $state, $ionicViewSwitcher, selectedChallenge, $ionicTabsDelegate, $ionicModal, ApiEndpoint, loadingService) {

  $scope.challenge = selectedChallenge.getChallenge();
  var setImageUrl = function(url) {
      if (url.substring(0, 1) == "/") {
        return ApiEndpoint.url2 + url;
      }
      return url;
    }
    /*-------- This method creates images based on the strings from backend ------ */
  var createImages = function() {
    $scope.cImages = [];
    if ($scope.challenge.images !== undefined) {
      $scope.challenge.images.forEach(function(image) {

        var i = 0;
        var imgString = image.trim(),
          parser = new DOMParser(),
          doc = parser.parseFromString(imgString, "text/html"),
          attSrc = doc.images[0].getAttribute('src'),
          src = setImageUrl(attSrc);
        $scope.cImages.push({
          img: '<img src="' + src + '">',
          pos: i
        });
        i += 1;
      })
    }
  }


  createImages();



  /*--- This method is called everytime we enter this controller ---*/
  $scope.$on('$ionicView.enter', function(e) {
    $scope.challenge = selectedChallenge.getChallenge();

    createImages();

  })


  /*---------- Fullscreen Images ------------- */

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });

  $scope.imageSrc = '';

  $scope.showImage = function(src) {
    $scope.imageSrc = src;
    $scope.openModal();
  }

  /*---------- Detail click Navigation -------------- */
  $scope.navDescription = function() {
    mixpanel.track("Challenge-Navigation-Click: Description");
    $state.go('challenge-details.details');
  }
  $scope.navGallery = function() {
    mixpanel.track("Challenge-Navigation-Click: Gallery");
    $state.go('challenge-details.intro');
  }
  $scope.navIdeas = function() {
    mixpanel.track("Challenge-Navigation-Click: Ideas");
    $state.go('challenge-details.ideas');
  }

  $scope.goToMain = function(challenge) {
    $ionicViewSwitcher.nextTransition('none');
    loadingService.simpleLoaderShow();
    $state.go('challenge');
    loadingService.loaderHide(500);
  }


})
