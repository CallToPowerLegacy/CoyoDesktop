(function () {
  'use strict';

  angular.module('coyo.apps.list')
      .factory('createFieldModalService', createFieldModalService)
      .controller('CreateFieldModalController', CreateFieldModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.list.createFieldModalService
   *
   * @description
   * Displays a modal to select / add a new field by type for the list app.
   */
  function createFieldModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.createFieldModalService#open
     * @methodOf coyo.apps.list.createFieldModalService
     *
     * @description
     * Opens the modal to create a new field for the list app by field type.
     *
     * @returns {object}
     * Returns a promise with the newly saved field.
     */
    function open(app) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/apps/list/components/create-field-modal.html',
        controller: 'CreateFieldModalController',
        controllerAs: '$ctrl',
        resolve: {
          app: function () {
            return app;
          }
        }
      }).result;
    }
  }

  function CreateFieldModalController($uibModalInstance, app) {
    var vm = this;

    vm.goBack = goBack;
    vm.save = save;

    function goBack() {
      delete vm.selectedFieldType;
      delete vm.field;
    }

    function save() {
      vm.field.senderId = app.senderId;
      vm.field.appId = app.id;
      return vm.field.save().then(function (field) {
        $uibModalInstance.close(field);
      });
    }
  }
})();
