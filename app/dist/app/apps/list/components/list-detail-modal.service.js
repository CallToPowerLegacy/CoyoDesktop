(function () {
  'use strict';

  angular.module('coyo.apps.list')
      .factory('listDetailModalService', listDetailModalService)
      .controller('ListDetailModalController', ListDetailModalController);

  function listDetailModalService(modalService) {

    return {
      open: open
    };

    function open(app, entry, mode) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/apps/list/components/list-detail-modal.html',
        controller: 'ListDetailModalController',
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
          },
          entry: function () {
            return entry;
          },
          mode: function () {
            return mode;
          }
        }
      }).result;
    }
  }

  function ListDetailModalController($stateParams, listEntryDetailsService, SenderModel, app, fieldTypeRegistry,
                                     fields, entry, mode, listService) {
    var vm = this;
    vm.app = app;
    vm.fields = fields;
    vm.entry = listService.initEntry(entry, vm.fields);

    vm.getValue = getValue;
    vm.switchTab = switchTab;
    vm.enableEditMode = enableEditMode;
    vm.$onInit = onInit,
    vm.updateHistory = updateHistory;

    function onInit() {
      if (mode === 'edit') {
        enableEditMode();
      } else {
        vm.activeTab = 'details';
      }
      updateHistory(vm.entry);

      listEntryDetailsService.registerEditCompleteHandler(onRegisterComplete);
    }

    function updateHistory(entry) {
      vm.history = {
        created: new Date(entry.created),
        modified: new Date(entry.modified),
        author: {},
        editor: {}
      };

      SenderModel.get(entry.author.id).then(function (author) {
        vm.history.author = author;
      });
      SenderModel.get(entry.editorId).then(function (editor) {
        vm.history.editor = editor;
      });
    }

    function onRegisterComplete(entry) {
      vm.entry = entry;
      updateHistory(entry);
      vm.switchTab('details');
    }

    function switchTab(tab) {
      vm.activeTab = tab;
    }

    function enableEditMode() {
      listEntryDetailsService.setCurrentContext({
        senderId: app.senderId,
        appId: app.id,
        id: $stateParams.id
      });
      vm.activeTab = 'edit';
    }

    function getValue(entry, fieldId) {
      var find = listService.getFieldValue(entry, fieldId);
      return find && find.value;
    }
  }
})();
