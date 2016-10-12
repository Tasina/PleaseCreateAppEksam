angular.module('starter')

.controller('NewIdeaCtrl', function($scope, $state, IdeaService, selectedChallenge, $stateParams, ionicToast) {
  console.log('MY IDEA ID ', $stateParams.id);

  $scope.newIdea = {
    raw: '',
    title: '',
    unlist_topic: false,
    category: $stateParams.id,
    is_warning: false,
    archetype: 'regular',
    nested_post: true
  }

  $scope.$on('$ionicView.enter', function(e) {
    $scope.newIdea = {
      raw: '',
      title: '',
      unlist_topic: false,
      category: $stateParams.id,
      is_warning: false,
      archetype: 'regular',
      nested_post: true
    }

  })
  console.log('slug : ', $scope.newIdea);

  $scope.createIdea = function() {
    console.log('My create idea:', $scope.newIdea);
    var idea = $scope.newIdea;
    if (idea.raw.length > 0 && idea.title.length > 0) {
      IdeaService.createIdea(idea, function(cb) {
        console.log('What happens if i try to create an idea: ', cb);
        if (cb.errors) {
          ionicToast.show(cb.errors[0], 'center', false, 2500);
        } else {
          ionicToast.show('Idea has been succesfully create', 'center', false, 2500);
        }
      })
    } else {
      ionicToast.show('Please enter valid data', 'center', false, 2500);
    }
  }

  $scope.goBack = function() {
    $state.go('challenge-details.ideas');
  }
})
