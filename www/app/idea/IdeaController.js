angular.module('starter')

.controller('IdeaCtrl', function($scope, $state, $stateParams, $document, IdeaService, ApiEndpoint, loadingService, $timeout, $ionicHistory, $ionicScrollDelegate, ionicToast, $ionicPopup, $localstorage) {

  var userId;
  $scope.topicId = $stateParams.id;
  $scope.ThisComments = [];
  $scope.allComments = [];
  $scope.nodata = true;
  $scope.newComment = {
    raw: '',
    unlist_topic: false,
    category: -1,
    topic_id: -1,
    is_warning: false,
    archetype: 'regular',
    nested_post: true
  }

  var count = 0;
  var icon;
  var popComment;
  /*------------- COMMENT  ---------*/
  $scope.addComment = function() {
    if (!$localstorage.userIsAuthed()) {
      ionicToast.show('You have to be logged in, to comment ideas', 'center', false, 2500);
    } else {
      popComment = $ionicPopup.show({
        templateUrl: 'app/idea/add-comment-template.html',
        title: 'Add comment',
        //subTitle: 'Comment must be more than 25 characters!',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Comment</b>',
          type: 'button-positive',
          onTap: function(e) {
            e.preventDefault();
            if ($scope.newComment.raw.length > 0) {
              tryToAddComment();

            } else {
              ionicToast.show('Please write valid comment!', 'center', false, 2500);
            }
          }
        }]
      });
    }
  }

  function tryToAddComment() {
    IdeaService.addComment($scope.newComment, function(cb) {
      var success = true;
      try {
        success = cb.data.success;
      } catch (e) {
        success = false;
      }
      if (success) {
        ionicToast.show('Your comment has been succesfully added!', 'center', false, 2500);
        $scope.newComment.raw = '';
        popComment.close();
      } else if (cb.errors) {
        ionicToast.show(cb.errors[0], 'center', false, 2500);
      } else {
        ionicToast.show('Something went wrong!', 'center', false, 2500);
      }
    })
  }


  $scope.$on('$ionicView.enter', function(e) {
    loadingService.loaderShow();
    loadData();
    loadingService.loaderHide(1000);
    $scope.newComment = {
      raw: '',
      unlist_topic: false,
      category: -1,
      topic_id: -1,
      is_warning: false,
      archetype: 'regular',
      nested_post: true
    }
  })

  var getIdeaInfo = function() {
    IdeaService.getIdeaInfo($scope.topicId, function(data) {
      var topicInfo = data.data;
      $scope.ideaTitle = topicInfo.title;
      userId = topicInfo.user_id;
      $scope.getLikeCount = topicInfo.like_count;
      $scope.getCommentCount = topicInfo.posts_count - 1;
    })
  }

  $scope.RefreshIdea = function() {
    console.log('REFRESH IDEA');
    $scope.ThisComments = [];
    count = 0;
    loadData();
    setTimeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }

  var loadData = function() {
    //Check if there is any comment
    $scope.hasComments = function() {
      if ($scope.allComments.length == 0) {
        return false;
      }
      return true;
    }


    IdeaService.getIdeaComment($scope.topicId, function(data) {

      $scope.topic = data.data;
      $scope.allComments = $scope.topic.post_stream.posts;
      split();
      $scope.allComments.splice(0, 1);
      $scope.allComments.forEach(function(comment) {
        singleIdeaImagesArray = [];

        var created = comment.created_at.split('T')[0];
        $scope.allComments.created_at = getDateString(created);

        comment.userImgLink = setCommentImg(comment);
        var text = comment.cooked;
        var ideaSlug = comment.topic_slug;
        try {
          comment.cooked = text.split('-/-')[0];

        } catch (err) {
          comment.cooked = text;
        }

        try {
          var images = text.match(/<img[^>]*>/g);
          setCommentDate(comment);

        } catch (err) {
          console.log("Cant create variables is broken width error - " + err);
        }

      })
      $scope.newComment.category = $scope.topic.category_id;
      $scope.newComment.topic_id = $scope.topic.id;

      //$scope.allComments.reverse();
      loadMoreComments();
      $scope.loadMoreData();
      getIdeaInfo();
      $scope.nodata = false;
    });
  }

  //Check if its me or you that comment
  $scope.commentYou = function(comment) {
    if (userId == comment.user_id) {
      return false;
    }
    return true;
  }

  var setCommentImg = function(comment) {
    var userAvatar = comment.avatar_template;
    if (userAvatar.substring(0, 1) == "/") {
      var newAvatar = ApiEndpoint.url2 + userAvatar;
      return newAvatar.replace("{size}", "100");
    } else {
      return userAvatar.replace("{size}", "100");
    }
  }
  var setCommentDate = function(comment) {
    var created = comment.created_at.split('T')[0];
    var time = comment.created_at.split('T')[1];
    comment.timefinished = time.substring(0, 5);
    comment.createtfinished = getDateString(created);
  }


  var loadMoreComments = function() {
    var allCommentIds = $scope.topic.post_stream.stream;
    var commentIds = [];
    if (allCommentIds.length > 20) {
      allCommentIds.splice(0, 20);
      for (var i = 0; i < allCommentIds.length; i++) {
        commentIds.push(allCommentIds[i])
      }
      IdeaService.getMoreComments($scope.topicId, commentIds, function(data) {
        var c = data.data.post_stream.posts;
        //c.reverse();
        c.forEach(function(comment) {
          comment.userImgLink = setCommentImg(comment);
          setCommentDate(comment);
          $scope.allComments.push(comment);
        })
      })
    }
  }

  $scope.loadMoreData = function() {
    console.log('LOADMOREDATA');
    pushIdea(count);
    pushIdea(count + 1);
    count += 2;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  function pushIdea(index) {
    var x = $scope.allComments[index];
    if (x) {
      $scope.ThisComments.push(x);
    } else {
      console.log('NODATA = TRUE (PUSH)');
      $scope.nodata = true;
    }

  }



  //-----------------------------Topic/Idea-------------------------------
  var split = function() {
    ideaSlug = "";
    singleIdeaImagesArray = [];

    var ideaInfo = $scope.topic.post_stream.posts[0];
    console.log(ideaInfo);
    $scope.username = ideaInfo.username;
    var created = ideaInfo.created_at.split('T')[0];
    $scope.createtfinished = getDateString(created);

    $scope.userImgLink = function() {
      var userAvatar = ideaInfo.avatar_template;
      if (userAvatar.substring(0, 1) == "/") {
        var newAvatar = ApiEndpoint.url2 + userAvatar;
        return newAvatar.replace("{size}", "100");
      } else {
        return userAvatar.replace("{size}", "100");
      }
    }

    var text = ideaInfo.cooked;
    var ideaSlug = ideaInfo.topic_slug;
    try {
      $scope.mainText = text.split('-/-')[0];
    } catch (err) {
      $scope.mainText = text;
    }

    try {
      var images = text.match(/<img[^>]*>/g);
      //var $path = $(".regular");
      var created = ideaInfo.created_at.split('T')[0];
      var time = ideaInfo.created_at.split('T')[1];
      $scope.timefinished = time.substring(0, 5);
      $scope.createtfinished = getDateString(created);
    } catch (err) {
      console.log("Cant create variables is broken width error - " + err);
    }
  }

  //---------------------------------Date---------------------------------
  function getDateString(date) {
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];
    var dateString = "";
    if (month == "01") {
      dateString = "Jan. " + day + ", " + year;
    } else if (month == "02") {
      dateString = "Feb. " + day + ", " + year;
    } else if (month == "03") {
      dateString = "Mar. " + day + ", " + year;
    } else if (month == "04") {
      dateString = "Apr. " + day + ", " + year;
    } else if (month == "05") {
      dateString = "May " + day + ", " + year;
    } else if (month == "06") {
      dateString = "Jun. " + day + ", " + year;
    } else if (month == "07") {
      dateString = "Jul. " + day + ", " + year;
    } else if (month == "08") {
      dateString = "Aug. " + day + ", " + year;
    } else if (month == "09") {
      dateString = "Sep. " + day + ", " + year;
    } else if (month == "10") {
      dateString = "Oct. " + day + ", " + year;
    } else if (month == "11") {
      dateString = "Nov. " + day + ", " + year;
    } else if (month == "12") {
      dateString = "Dec. " + day + ", " + year;
    }
    return dateString;
  }

  //--------------------------------Image----------------------------
  function getImgSize(imgSrc) {
    var string = String(imgSrc);
    console.log("this is a string - " + string);
    //var newImg = new Image();
    //newImg.src = imgSrc;
    var substring = "emoji";
    if (string.indexOf(substring) == -1) {
      return true;
      console.log("This is not a smilly");
    } else {
      return false;
      console.log("This is a smilly");

    }
  }

  /*
    var icons = function() {
      if(ionic.Platform.isIOS()){
        icon = 'ion-ios-arrow-back'
      }else if(ionic.Platform.isAndroid()){
        icon = 'ion-android-arrow-back';
      }else{
        icon = 'ion-android-arrow-back';
      }
    }
    */

  $scope.createIdea = function() {
    IdeaService.createIdea($scope.newIdea, function(cb) {
      console.log(cb);
    })
  }

  /*  $scope.bottomArrow = function() {
      var currentTop = $ionicScrollDelegate.$getByHandle('scrollTop').getScrollPosition().top;
      var maxScrollableDistanceFromTop = $ionicScrollDelegate.$getByHandle('scrollTop').getScrollView().__maxScrollTop;
      console.log('Trying to set arrow down');
      if (currentTop <= maxScrollableDistanceFromTop) {
        return true;
      }
      return false;
    };

    $scope.topArrow = function() {
      var currentTop = $ionicScrollDelegate.$getByHandle('scrollTop').getScrollPosition().top;
      var maxScrollableDistanceFromTop = $ionicScrollDelegate.$getByHandle('scrollTop').getScrollView().__maxScrollTop;
      console.log('Trying to set arrow up');
      if (currentTop >= maxScrollableDistanceFromTop) {
        return true;
      }
      return false;
    };

      $scope.scrollToBottom = function() {
        console.log('Trying to scroll bottom');
        $ionicScrollDelegate.scrollBottom();
      }*/

  $scope.scrollToTop = function() {
    console.log('SCROLLING TOP !!');
    console.log('my idea', $scope.topic);
    $ionicScrollDelegate.$getByHandle('scrollTop').scrollTop();
  }

  $scope.AddComment = function() {
    console.log('CreateComment');
  }



  $scope.goBack = function() {

    $scope.lastViewTitle = $ionicHistory.backTitle();

    if ($scope.lastViewTitle == null) {
      $state.go('myProfile');
    }

    if ($scope.lastViewTitle == "Profile") {
      $state.go('myProfile');
    } else if ($scope.lastViewTitle == "ChallengeIdeas") {
      $state.go('challenge-details.ideas');
    } else {
      $ionicHistory.goBack();
    }
  }

})
