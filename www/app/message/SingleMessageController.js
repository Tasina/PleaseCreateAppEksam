angular.module('starter').controller('SingleMsgCtrl', function ($scope, $state, $location) {

  $scope.goBack = function ($event) {
    $location.path("/messages");
  };

  /*$scope.showSettings = function ($event) {

  }

  $scope.sMsg = [{
    userId: 2,
    title: 'Hey',
    Date: '2010-12-28T14:57:00'
  }, {
    userId: 1,
    title: 'yeah u gotta file once every 2 weeks at least',
    Date: '2010-12-28T14:59:00'
  }, {
    userId: 1,
    title: 'most*??',
    Date: '2010-12-28T14:57:00'
  }, {
    userId: 2,
    title: 'Type whatever you want below.',
    Date: '2010-12-28T15:57:00'
  }, {
    userId: 1,
    title: 'and u gotta groom eyebrows once every 10 days at least',
    Date: '2010-12-28T20:09:00'
  }, {
    userId: 1,
    title: 'and u gotta groom eyebrows once every 10 days at least',
    Date: '2011-01-16T13:30:00'
  }, {
    userId: 2,
    title: 'Press enter or click the blue circle to send',
    Date: '2011-01-15T14:57:00'
  }, {
    userId: 2,
    title: 'I cant reply yet... Maybe one day.',
    Date: '2011-2-01T11:00:00'
  }, {
    userId: 1,
    title: 'you females have it tough im sorry',
    Date: '2011-05-21T00:57:00'
  }, {
    userId: 2,
    title: 'So much to maintain',
    Date: '2011-05-29T21:02:00'
  }, {
    userId: 2,
    title: 'Type whatever you want below.',
    Date: '2011-09-05T05:39:00'
  }];*/





  var $messages = $('.messages-content'),
    h, d, m,
    i = 0;

  $(window).load(function () {
    $messages.mCustomScrollbar();
    setTimeout(function () {
      fakeMessage();
    }, 100);
  });

  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

  function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }

  function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    setTimeout(function () {
      fakeMessage();
    }, 1000 + (Math.random() * 20) * 100);
  }

  $('.message-submit').click(function () {
    insertMessage();
  });



});
