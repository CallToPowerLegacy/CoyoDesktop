(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoShake', shake);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoShake:coyoShake
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Listens to an event and shakes the given element if it receives the signal.
   *
   * @requires $animate
   *
   * @param {string} signal The signal to listen to
   * @param {string} cssClass The css animation class to add when the signal appears
   */
  function shake($animate) {
    return {

      scope: {
        signal: '=',
        cssClass: '='
      },
      link: function (scope, element) {

        /**
         * Check for signals. If signal is triggered, shake the element
         */
        var deregSignal = scope.$on(scope.signal, function () {
          $animate.removeClass(element, scope.cssClass).then(function () {
            $animate.addClass(element, scope.cssClass);
          });
        });

        scope.$on('$destroy', deregSignal);
      }
    };
  }

})(angular);
