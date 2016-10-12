angular.module('starter')

.factory('$localstorage', ['$window', function($window) {

  var minASCII = 33;
  var maxASCII = 126;
  /**
   * Return a random key generated from a set of ASCII characters, to use with the above encryption-process.
   */
  var getRandomKey = function() {
    var key = "";
    for (var i = 0; i < 10; i++) {
      var random = minASCII + (Math.random() * (maxASCII - minASCII));
      key += String.fromCharCode(Math.ceil(random));
    }
    return key;
  }

  var encryption_key = 'encryption_key';
  //If encryption-key doesn't exist, Create one!
  var checkEncryptionKey = function() {
    if (!$window.localStorage[encryption_key]) {
      $window.localStorage[encryption_key] = getRandomKey();
      //console.log('generating key: ' + $window.localStorage[ckey]);
    }
  }
  checkEncryptionKey();

  return {
    set: function(key, value) {
      checkEncryptionKey();
      //Get cryption key
      var enc_key = $window.localStorage[encryption_key];
      //Encrypt save-value
      var cValue = sjcl.encrypt(enc_key, value);
      //save encrypted value to local-storage
      $window.localStorage[key] = cValue;
    },
    get: function(key, defaultValue) {
      //Get cryption key
      var enc_key = $window.localStorage[encryption_key];
      //Get encrypted value
      var cValue = $window.localStorage[key];
      //Decrypt value
      var value = sjcl.decrypt(enc_key, cValue);
      //Return value
      return value || defaultValue;
    },
    //Check if user is saved to localstorage
    userIsAuthed: function() {
      if ($window.localStorage['user'] && $window.localStorage['user_token'] && $window.localStorage[encryption_key] && $window.localStorage['user_pw']) {
        return true;
      } else {
        return false;
      }
    },
    clearStorage: function() {
      $window.localStorage.removeItem('user');
      $window.localStorage.removeItem('user_token');
    }
  }
}]);
