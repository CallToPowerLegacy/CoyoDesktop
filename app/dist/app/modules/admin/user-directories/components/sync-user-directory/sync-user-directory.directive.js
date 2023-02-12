(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .component('coyoSyncUserDirectory', syncUserDirectory())
      .controller('SyncUserDirectoryController', SyncUserDirectoryController);

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.coyoSyncUserDirectory:coyoSyncUserDirectory
   * @restrict E
   * @scope
   *
   * @description
   * Renders a button to start a user directory synchronization job.
   *
   * @param {object} userDirectory
   * The userDirectory.
   */
  function syncUserDirectory() {
    return {
      scope: {},
      controller: 'SyncUserDirectoryController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/user-directories/components/sync-user-directory/sync-user-directory.html',
      bindings: {
        userDirectory: '<'
      }
    };
  }

  function SyncUserDirectoryController() {
    var vm = this;

    vm.sync = sync;

    function sync() {
      vm.userDirectory.sync();
    }
  }

})(angular);
