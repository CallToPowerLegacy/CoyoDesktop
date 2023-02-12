(function () {
  'use strict';

  angular.module('coyo.apps.list')
      .factory('addEntryModalService', addEntryModalService)
      .controller('AddEntryModalController', AddEntryModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.list.addEntryModalService
   *
   * @description
   * Displays a modal to add a new entry to the list
   */
  function addEntryModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.addEntryModalService#open
     * @methodOf coyo.apps.list.addEntryModalService
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
        templateUrl: 'app/apps/list/components/add-entry-modal.html',
        controller: 'AddEntryModalController',
        controllerAs: '$ctrl',
        resolve: {
          app: function () {
            return app;
          },
          fields: /*@ngInject*/ function (ListFieldModel) {
            var context = {
              senderId: app.senderId,
              appId: app.id
            };
            return ListFieldModel.get(context);
          }
        }
      }).result;
    }
  }

  function AddEntryModalController($uibModalInstance, app, fields, listService) {
    var vm = this;
    vm.fields = fields;
    vm.entry = listService.createEntry();

    vm.save = save;

    function save() {
      vm.entry.senderId = app.senderId;
      vm.entry.appId = app.id;
      vm.entry.save().then(function (result) {
        $uibModalInstance.close(result);
      });
    }
  }
})();
