angular.module('starter')

.factory('IdeaService', function($http, ApiEndpoint, $localstorage, $q, LoginService) {
  console.log('ApiEndpoint', ApiEndpoint)

  var getIdeaComment = function(id, cb) {
    return $http.get(ApiEndpoint.url + 't/' + id + '/posts.json')
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting specific idea comments: ', error);
      }
  }

  var getIdeaInfo = function(id, cb) {
    return $http.get(ApiEndpoint.url + 't/' + id + '.json')
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting idea info: ', error);
      }
  }

  var getMoreComments = function(id, commentIds, cb) {
    var commentIdeas = '';
    var firstComment = commentIds[0];
    commentIds.splice(0, 1);
    commentIds.forEach(function(comment) {
      commentIdeas += '&post_ids[]=' + comment;
    })
    return $http.get(ApiEndpoint.url + 't/' + id + '/posts.json?post_ids[]=' + firstComment + commentIdeas)
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        console.log('Problem getting all comments: ', error);
      }
  }

  var createIdea = function(idea, cb) {
    var token = $localstorage.get('user_token');
    console.log('TOKEN IN POST', token);
    return $http.post(ApiEndpoint.url + 'posts', idea, {
        headers: {
          'x-csrf-token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).error(function(error) {
        cb(error);
      })
      .then(function(data) {
        cb(data);
      }),
      function error(error) {
        cb(data);
      }
  }

  var addComment = function(comment, cb) {
    var deff = $q.defer();
    var token = $localstorage.get('user_token');
    console.log('TOKEN IN POST', token);
    return $http.post(ApiEndpoint.url + 'posts', comment, {
        headers: {
          'x-csrf-token': token,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .error(function(error) {
        cb(error);
      })
      .then(function(data) {
        console.log('thendata', data);
        cb(data);
      }),
      function error(error) {
        console.log('function error', error);
        cb(error);
      }

  }

  return {
    getIdeaComment: getIdeaComment,
    createIdea: createIdea,
    addComment: addComment,
    getMoreComments: getMoreComments,
    getIdeaInfo: getIdeaInfo
  };

})
