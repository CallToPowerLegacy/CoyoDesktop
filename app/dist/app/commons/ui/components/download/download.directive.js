(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoDownload', download);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoDownload:coyoDownload
   * @element ANY
   * @restrict A
   *
   * @description
   * Adds a click handler to the given element that triggers the download of the provided url. Will ignore the
   * "leave page" browser alert when the current state is locked.
   * Important: do not use with non-download urls, otherwise it will break the page locking mechanism.
   *
   * @param {expr} coyoDownload expression that will be parsed against the current scope to get the download url
   *
   * @requires $parse
   * @requires $window
   * @requires $q
   * @requires $http
   * @requires $log
   * @requires commons.error.stateLockService
   *
   */
  function download($parse, $window, $q, $http, $log, stateLockService) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        function clickHandler() {
          $q.when($parse(attributes.coyoDownload)(scope)).then(function (url) {
            stateLockService.ignoreLock(function () {
              $http.head(url).then(function () {
                $window.location = url;
              }).catch(function (message) {
                $log.debug('could not fetch file from server, must be deleted or there are insufficient permissions ' + message);
              });
            });
          });
        }
        element.bind('click', clickHandler);
        scope.$on('$destroy', function () {
          element.unbind('click', clickHandler);
        });
      }
    };
  }
})();
