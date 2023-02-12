(function (angular) {
  'use strict';

  angular
      .module('commons.target')
      .controller('TargetController', TargetController);

  /**
   * Controller for the target view
   */
  // TODO: Just redirect without a view?
  function TargetController($log, $state, $location, targetService, $translate) {
    var vm = this;

    vm.showOriginalTarget = false;
    vm.status = {
      loading: true,
      error: false
    };

    function checkURLParameters() {
      vm.status.loading = true;

      vm.targetName = 'COMMONS.TARGET.HEADER';
      vm.targetNameOriginal = $state.params.targetID;
      if ($state.params.targetID) {
        $log.debug('[TargetController] Found target \'' + $state.params.targetID + '\'');
        // check whether the i18n message key exists,
        // otherwise display the original target key with a default value
        $translate('COMMONS.TARGET.TARGETS.' + $state.params.targetID.toUpperCase()).then(function (translation) {
          if (translation.indexOf('COMMONS.TARGET.TARGETS.') === -1) {
            vm.showOriginalTarget = false;
            vm.targetName = 'COMMONS.TARGET.TARGETS.' + $state.params.targetID.toUpperCase();
          } else {
            vm.showOriginalTarget = true;
          }
        });

        var target = {
          name: $state.params.targetID,
          params: $location.search()
        };

        try {
          $log.debug('[TargetController] Trying to call target', target);
          targetService.go(target);
        } catch (ex) {
          vm.status.error = true;
        } finally {
          vm.status.loading = false;
        }
      } else {
        $log.error('[TargetController] Error: Empty target');
        vm.status.loading = false;
        vm.status.error = true;
      }
    }

    (function _init() {
      checkURLParameters();
    })();
  }

})(angular);
