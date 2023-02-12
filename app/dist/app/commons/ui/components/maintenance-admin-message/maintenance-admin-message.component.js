(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.maintenanceAdminMessage:maintenanceAdminMessage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a bar on the bottom of the screen when the admin has enabled maintenance mode to remind him that
   * the maintenance mode for his tenant is active although he as an admin can still access the whole site.
   */
  var maintenanceAdminMessageComponent = {
    templateUrl: 'app/commons/ui/components/maintenance-admin-message/maintenance-admin-message.html',
    controller: 'MaintenanceAdminMessageController'
  };

  angular
      .module('commons.ui')
      .controller('MaintenanceAdminMessageController', MaintenanceAdminMessageController)
      .component('oyocMaintenanceAdminMessage', maintenanceAdminMessageComponent);

  function MaintenanceAdminMessageController($rootScope, MaintenanceModel) {
    var vm = this;

    vm.$onInit = onInit;

    function _getMaintenanceAdminMessageActive() {
      MaintenanceModel.getPublic().then(function (maintenance) {
        if (maintenance && maintenance.type === 'TENANT_MAINTENANCE') {
          $rootScope.maintenanceAdminMessageActive = true;
          vm.display = true;
        }
      });
    }

    function onInit() {
      $rootScope.$on('onMaintenanceAdminMessageStateChange', function (active) {
        vm.display = active;
      });

      _getMaintenanceAdminMessageActive();
    }
  }
})(angular);
