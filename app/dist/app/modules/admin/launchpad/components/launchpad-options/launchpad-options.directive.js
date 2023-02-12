(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.launchpad')
      .directive('oyocLaunchpadOptions', launchPadOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.launchpad.oyocLaunchpadPageOptions:oyocLaunchpadPageOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for launchpad list.
   *
   * @param {object} actions actions
   * @param {object} page page
   */
  function launchPadOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/launchpad/components/launchpad-options/launchpad-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        category: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
