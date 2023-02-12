(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingSidebar', messagingSidebar);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingSidebar:oyocMessagingSidebar
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the main messaging sidebar.
   */
  function messagingSidebar() {
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-sidebar/messaging-sidebar.html',
      controller: 'MessagingSidebarController',
      controllerAs: 'msgSidebar'
    };
  }

})(angular);
