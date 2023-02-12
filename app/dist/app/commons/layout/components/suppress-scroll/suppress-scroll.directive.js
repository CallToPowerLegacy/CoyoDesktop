(function (angular) {
  'use strict';

  angular
      .module('commons.layout')
      .directive('oyocSuppressScroll', suppressScroll)
      .controller('SuppressScrollController', SuppressScrollController);

  /**
   * @ngdoc directive
   * @name coyo.app.oyocSuppressScroll:oyocSuppressScroll
   * @element ANY
   * @restrict A
   * @scope
   *
   * @description
   * Suppress the scrolling of the given container when a modal or sidebar is open.
   *
   * @requires $scope
   * @requires $rootScope
   * @requires $element
   * @requires $window
   */
  function suppressScroll() {
    return {
      restrict: 'A',
      controller: 'SuppressScrollController'
    };
  }

  function SuppressScrollController($scope, $rootScope, $element, $window) {
    var currentScroll = 0;
    var bodyElement = angular.element('body');
    var bodyWrapper = angular.element('.body');

    $scope.$watch(function () {
      return $rootScope.showBackdrop || bodyElement.hasClass('modal-open');
    }, function (newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      if (newValue) {
        currentScroll = $window.scrollY;
        bodyWrapper.css('position', 'fixed');
        $element.css({'position': 'absolute', 'top': -currentScroll});
      } else {
        bodyWrapper.css('position', 'static');
        $element.css({'position': 'static', 'top': 0});
        bodyElement.scrollTop(currentScroll);
      }
    });
  }
})(angular);
