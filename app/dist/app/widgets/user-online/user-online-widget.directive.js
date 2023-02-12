(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.useronline')
      .directive('coyoUserOnlineWidget', userOnlineWidget)
      .controller('UserOnlineWidgetController', UserOnlineWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.useronline:coyoUserOnlineWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show currently online users.
   *
   * @param {object} widget
   * The widget configuration
   */
  function userOnlineWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/user-online/user-online-widget.html',
      scope: {
        widget: '<'
      },
      controller: 'UserOnlineWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function UserOnlineWidgetController(userService) {
    var vm = this;

    (function _init() {
      vm.loading = true;
      return userService.getUserOnlineCount().then(function (onlineData) {
        vm.onlineData = onlineData;
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
