(function () {
  'use strict';

  angular.module('coyo.apps.list')
      .factory('editFieldModalService', editFieldModalService)
      .controller('EditFieldModalController', EditFieldModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.list.editFieldModalService
   *
   * @description
   * Displays a modal to edit an existing field for the list app.
   */
  function editFieldModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.editFieldModalService#open
     * @methodOf coyo.apps.list.editFieldModalService
     *
     * @description
     * Opens the modal to edit an existing field of the list.
     *
     * @param {object} field
     * The field to edit in the modal
     *
     * @returns {object}
     * Returns a promise with the edited and updated field.
     */
    function open(field) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/apps/list/components/edit-field-modal.html',
        controller: 'EditFieldModalController',
        controllerAs: '$ctrl',
        resolve: {
          field: function () {
            return angular.copy(field);
          }
        }
      }).result;
    }

  }

  function EditFieldModalController(fieldTypeRegistry, $uibModalInstance, field) {
    var vm = this;

    vm.field = field;
    vm.fieldType = {};

    vm.$onInit = init;
    vm.save = save;

    function init() {
      vm.fieldType = fieldTypeRegistry.get(vm.field.key);
    }

    function save() {
      return vm.field.save().then(function (field) {
        $uibModalInstance.close(field);
      });
    }
  }

})();
