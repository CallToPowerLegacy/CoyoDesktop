(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocModeratorBar', moderatorBar)
      .controller('moderatorBarController', moderatorBarController);

  /**
   * @ngdoc directive
   * @name commons.ui.moderatorBar:moderatorBar
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a bar on the bottom of the screen when a user changes to moderator mode. The moderator mode can be
   * disabled with a link on the bar. Note that disabling the moderator mode causes a full page reload to happen.
   *
   * @requires $window
   * @requires commons.auth.authService
   */
  function moderatorBar() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/moderator-bar/moderator-bar.html',
      scope: {},
      bindToController: {},
      controller: 'moderatorBarController',
      controllerAs: '$ctrl'
    };
  }

  function moderatorBarController($window, $sessionStorage, $scope, authService) {
    var vm = this;
    vm.deactivate = deactivate;

    $scope.$watch(function () {
      return _.get($sessionStorage, 'messagingSidebar.compact', false);
    }, function (newVal) {
      vm.compact = newVal;
    });

    function deactivate() {
      if (vm.user) {
        vm.user.setModeratorMode(false).then(function () {
          $window.location.reload();
        });
      }
    }

    (function _init() {
      authService.getUser().then(function (user) {
        vm.user = user;
      });
    })();
  }
})();
