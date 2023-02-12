(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .controller('MessagingPresenceStatusController', MessagingPresenceStatusController);

  /**
   * Controller for managing the current user's presence status.
   */
  function MessagingPresenceStatusController() {
    var vm = this;

    vm.availableStates = ['ONLINE', 'AWAY', 'BUSY', 'GONE', 'OFFLINE'];
    vm.updateState = updateState;
    vm.updateLabel = updateLabel;
    vm.resetLabel = resetLabel;

    // ------------------------------------------------------------------------------

    function updateState(state) {
      vm.presenceStatus.state = state;
      _saveStatus(vm.presenceStatus);
    }

    function updateLabel(label) {
      vm.presenceStatus.label = label;
      _saveStatus(vm.presenceStatus);
    }

    function resetLabel() {
      vm.labelText = vm.presenceStatus.label;
    }

    function _saveStatus(status) {
      vm.loading = true;
      vm.currentUser.updatePresenceStatus(status).finally(function () {
        vm.loading = false;
      });
    }

    (function _init() {
      vm.labelText = vm.presenceStatus.label;
    })();
  }

})(angular);
