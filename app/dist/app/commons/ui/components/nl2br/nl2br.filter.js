(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('nl2br', nl2br);

  /**
   * @ngdoc filter
   * @name commons.ui:nl2br
   * @function
   *
   * @description
   * nl2br linky-compatible angular filter
   *
   * @see https://gist.github.com/habovh/3dcb42d18975375d5247
   */
  function nl2br($sanitize) {
    var tag = '<br />';
    return function (msg) {
      // ngSanitize's linky filter changes \r and \n to &#10; and &#13; respectively
      msg = (msg + '').replace(/(\r\n|\n\r|\r|\n|&#10;&#13;|&#13;&#10;|&#10;|&#13;)/g, tag + '$1');
      return $sanitize(msg);
    };
  }

})(angular);
