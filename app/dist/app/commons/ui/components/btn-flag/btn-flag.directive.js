(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoBtnFlag', coyoBtnFlag)
      .controller('BtnFlagController', BtnFlagController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnFlag:coyoBtnFlag
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a flag button from the perspective of the current user.
   *
   * @requires $log
   *
   * @param {object} target The target to be flagged.
   */
  function coyoBtnFlag() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/btn-flag/btn-flag.html',
      scope: {},
      bindToController: {
        target: '<'
      },
      controller: 'BtnFlagController',
      controllerAs: '$ctrl'
    };
  }

  function BtnFlagController($log) {
    var vm = this;

    vm.isLoading = false;
    vm.isActive = false;
    vm.flag = flag;

    function flag() {
      if (vm.isLoading) {
        return;
      }

      $log.warn('Function flag() not implemented');
    }
  }

})(angular);
