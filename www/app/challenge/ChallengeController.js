angular.module('starter')

.controller('ChallengeCtrl', function($scope, $localstorage, $ionicViewSwitcher, $state, ChallengeService, selectedChallenge, LoginService, loadingService, ApiEndpoint, $ImageCacheFactory) {
  $scope.showChallenges = [];
  var count = 0;

  $scope.nodata = true;
  /**The data function gets all categories and sets up
   * up all nessesary information for a readable and managable
   * conversion
   */



  $scope.$on('$ionicView.enter', function(e) {
    console.log('entering this view');
    selectedChallenge.removeSelectedChallenge();
  })

  /*
    $scope.OnScrolling = function() {
      var x = document.querySelector(".radial");
      x.style = "display:none";
      console.log('scrolling');
    }*/

  $scope.RefreshChallenges = function() {
    $scope.showChallenges = [];
    count = 0;
    getChallenges();
    setTimeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }

  var data = function() {
    loadingService.loaderShow();
    getChallenges();
    loadingService.loaderHide(2500);
  }
  data();

  function getChallenges() {
    var bgImages = [];
    ChallengeService.getAllCategories(function(data) {
      //console.log(data);

      $scope.challenges = data.data.category_list.categories;
      $scope.challenges.forEach(function(c) {
        console.log(c);
        c.logo_url = setImageUrl(c.logo_url);
        c.background_url = setImageUrl(c.background_url);
        bgImages.push(c.background_url);

        setAboutText(c);
      })
      $ImageCacheFactory.Cache(bgImages);

      $scope.loadMoreData();
      $scope.nodata = false;
    });
  }

  $scope.goHome = function() {
    $state.go('myProfile');
  }

  $scope.loadMoreData = function() {
    pushChallenge(count);
    pushChallenge(count + 1);
    count += 2;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  function pushChallenge(index) {
    var c = $scope.challenges[index];
    if (c) {
      $scope.showChallenges.push(c);
    } else {
      $scope.nodata = true;
    }
  }

  $scope.goToChallenge = function(challenge) {
    loadingService.simpleLoaderShow();
    $ionicViewSwitcher.nextTransition('none');
    mixpanel.track("User navigated to a specific challenge");
    selectedChallenge.setSelectedChallenge(challenge);
    $state.go('challenge-details.details');
    loadingService.loaderHide(500);
  }

  var setImageUrl = function(url) {
    if (!url) {
      return 'img/plane2.png';
    } else if (url.substring(0, 1) == "/") {
      return ApiEndpoint.url2 + url;
    }
    return url;
  }

  function setAboutText(c) {
    ChallengeService.getTopicInfo(c.topic_url, function(data) {
      var topic = data.data.post_stream.posts[0].cooked;
      getDataFromText(c, topic);
    });
  }

  function getDataFromText(challenge, text) {
    var type = "none";
    var price = "none";
    var category_description = "none";
    var finish_date_year;
    var finish_date_month;
    var finish_date_day

    var images = text.match(/<img[^>]*>/g);
    challenge.images = images;

    text = text.replace(/<img[^>]*>/g, "");

    try {
      if (text.split('-b-').length > 1) {
        type = "B2B";
        var challengeType = text.split('-b-')[0];
        challenge.challengeTypeName = text.split('-b-')[1];
        var tempText = text.split('-b-')[2];
        category_description = tempText.split('-/-')[2];
        var price_text = tempText.split('-/-')[0];
        price = price_text.split('-/p/-')[0];
        price_description = price_text.split('-/p/-')[1];
        var finish_date = tempText.split('-/-')[1];
        finish_date_year = finish_date.split('-')[0];
        finish_date_month = finish_date.split('-')[1];
        finish_date_day = finish_date.split('-')[2];

      } else if (text.split('-/type/-').length > 1) {
        type = text.split('-/type/-')[0];
        type = type.replace("<p>", "");
        var tempText = text.split('-/type/-')[1];
        category_description = tempText.split('-/-')[2];
        var price_text = tempText.split('-/-')[0];
        price = price_text.split('-/p/-')[0];
        price_description = price_text.split('-/p/-')[1];
        var finish_date = tempText.split('-/-')[1];
        finish_date_year = finish_date.split('-')[0];
        finish_date_month = finish_date.split('-')[1];
        finish_date_day = finish_date.split('-')[2];

      } else if (text.split('-/-').length > 1) {
        category_description = text.split('-/-')[2];
        var price_text = text.split('-/-')[0];
        price = price_text.split('-/p/-')[0];
        price_description = price_text.split('-/p/-')[1];
        var finish_date = text.split('-/-')[1];
        finish_date_year = finish_date.split('-')[0];
        finish_date_month = finish_date.split('-')[1];
        finish_date_day = finish_date.split('-')[2];

      }
    } catch (err) {
      console.log('error');
      challenge.challengeText = text;
    }
    var daysToFinish = getDaysLeft(finish_date_day, finish_date_month, finish_date_year);

    challenge.challengeText = category_description;
    challenge.challengePrice = price.substring(0, price.indexOf('('));
    if (!challenge.challengePrice) {
      challenge.challengePrice = 'Click to see'
    }
    challenge.challengePrice_description = price_description;
    challenge.challengeType = type;
    challenge.challengeDaysToFinish = daysToFinish;
    challenge.challengeImages = images;
  }
  var montharray = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

  function getDaysLeft(day, month, year) {
    var theyear = parseInt(year);
    var themonth = parseInt(month);
    var theday = parseInt(day);
    var today = new Date();
    var todayy = today.getYear();
    if (todayy < 1000);
    todayy += 1900;
    var todaym = today.getMonth();
    var todayd = today.getDate();
    var todayh = today.getHours();
    var todaymin = today.getMinutes();
    var todaysec = today.getSeconds();
    var todaystring = montharray[todaym] + " " + todayd + ", " + todayy + " " + todayh + ":" + todaymin + ":" + todaysec;
    var futurestring = montharray[themonth - 1] + " " + theday + ", " + theyear;
    var dd = Date.parse(futurestring) - Date.parse(todaystring);
    var dday = Math.floor(dd / (60 * 60 * 1000 * 24) * 1);
    //var dhour=Math.floor((dd%(60*60*1000*24))/(60*60*1000)*1);
    //var dmin=Math.floor(((dd%(60*60*1000*24))%(60*60*1000))/(60*1000)*1);
    //var dsec=Math.floor((((dd%(60*60*1000*24))%(60*60*1000))%(60*1000))/1000*1);
    if (dday > 0) {
      return dday;
    } else return -1;
  }

  $scope.showDays = function(challenge) {
    if (challenge.challengeDaysToFinish > 0) {
      return challenge.challengeDaysToFinish + 'd left';
    }
    return 'Ended';
  }

  $scope.challengeEnd = function(challenge) {
    if (challenge.challengeDaysToFinish > 0) {
      return null
    }
    return 'The challenge has ended';
  }

  $scope.isFinished = function(challenge) {
    if (challenge.challengeDaysToFinish > 0) {
      return false;
    }
    return true;
  }

  $scope.isPrivate = function(challenge) {
    if (challenge.challengeTypeName) {
      return true;
    }
    return false;
  }

});
