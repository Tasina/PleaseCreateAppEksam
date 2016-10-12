angular.module('starter')

//NOTE: We are including the constant `ApiEndpoint` to be used here.
.factory('ChallengeService', function($http, ApiEndpoint) {

  var getAllCategories = function(cb) {
    return $http.get(ApiEndpoint.url + 'categories.json', {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(data) {
        //console.log('Got some data: ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting challenges: ', error);
      }
  }

  var getTopicInfo = function(endUrl, cb) {
    return $http.get(ApiEndpoint.url2 + endUrl + '.json')
      .then(function(data) {
        //console.log('topicInfo: ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting topic info: ', error);
      }
  }

  var getIdeas = function(challengeName, cb) {
    return $http.get(ApiEndpoint.url + 'c/' + challengeName + '.json')
      .then(function(data) {
        //console.log('Topics: ', data);
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting ideas: ', error);
      }
  }

  return {
    getAllCategories: getAllCategories,
    getIdeas: getIdeas,
    getTopicInfo: getTopicInfo
  }
})

.service('selectedChallenge', function() {
  var challenge = {
    test: 'test'
  };

  var setSelectedChallenge = function(object) {
    challenge = object;
  };
  var removeSelectedChallenge = function() {
    console.log('removing');
    challenge = undefined;
  };
  var getChallenge = function() {
    return challenge;
  };

  return {
    setSelectedChallenge: setSelectedChallenge,
    removeSelectedChallenge: removeSelectedChallenge,
    getChallenge: getChallenge
  }
})
