(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSpinner
   * @restrict 'E'
   *
   * @description Displays a spinner.
   */
  angular.module('commons.ui')
      .directive('coyoSpinner', CoyoSpinner);

  function CoyoSpinner() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        size: '@',
        inverted: '<'
      },
      templateUrl: 'app/commons/ui/components/spinner/spinner.html'
    };
  }
})();
