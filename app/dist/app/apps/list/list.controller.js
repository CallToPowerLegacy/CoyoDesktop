(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListController', ListController);

  function ListController($scope, $state, app, fields, createFieldModalService, addEntryModalService, ListEntryModel,
                          Pageable, coyoNotification, socketService, modalService, listService, listSortService, fieldTypeRegistry) {

    var vm = this;
    var sortQuery = 'created,DESC';

    vm.app = app;
    vm.fields = fields;
    vm.loading = false;
    vm.search = '';

    vm.$onInit = init;
    vm.createField = createField;
    vm.addEntry = addEntry;
    vm.viewEntry = viewEntry;
    vm.editEntry = editEntry;
    vm.getValue = getValue;
    vm.getConfig = getConfig;
    vm.sort = sort;
    vm.save = save;
    vm.searchKeyPressed = searchKeyPressed;
    vm.showCreateEntryForm = showCreateEntryForm;
    vm.deleteEntry = deleteEntry;

    function init() {
      if (vm.fields && vm.fields.length) {
        listSortService.initSortConfig(vm.fields, vm.app.id);
        sort();
      }
      var unsubscribe = socketService.subscribe('/topic/app.list.' + app.senderId + '.' + app.id + '.entry.updated', listEntryUpdated);
      $scope.$on('$destroy', function () {
        unsubscribe();
      });
    }

    function listEntryUpdated($event) {
      var context = {
        senderId: app.senderId,
        appId: app.id,
        id: $event.content
      };

      var index = _.findIndex(vm.currentPage.content, function (entry) {
        return $event.content === entry.id;
      });

      if (index >= 0) {
        ListEntryModel.getWithPermissions(context, {}, ['edit', 'delete', 'comment']).then(function (result) {
          vm.currentPage.content[index] = result;
        });
      }
    }

    function searchKeyPressed() {
      _loadData();
    }

    function sort() {
      sortQuery = listSortService.createSortQuery();
      listSortService.storeSortConfig(vm.app.id);
      _loadData();
    }

    function createField() {
      createFieldModalService.open(app).then(function () {
        $state.go('^.configure');
      });
    }

    function addEntry() {
      addEntryModalService.open(app).then(function () {
        _loadData();
        _updateAppPermissions();
      });
    }

    function viewEntry(entry) {
      $state.go('.details', {
        id: entry.id
      });
    }

    function editEntry(entry) {
      $state.go('.details', {
        id: entry.id,
        mode: 'edit'
      });
    }

    function getValue(entry, fieldId) {
      return listService.getFieldValue(entry, fieldId);
    }

    function getConfig(key) {
      return fieldTypeRegistry.get(key).render;
    }

    function save(form) {
      vm.entry.senderId = vm.app.senderId;
      vm.entry.appId = vm.app.id;
      vm.entry.save().then(function () {
        coyoNotification.success('APP.LIST.ADD_ENTRY.SUCCESS');
        vm.entry = {};
        form.$setPristine();
        _updateAppPermissions();
      }).catch(function () {
        coyoNotification.error('APP.LIST.ADD_ENTRY.ERROR');
      });
    }

    function deleteEntry(entry) {
      vm.entry = entry;
      vm.entry.appId = vm.app.id;
      vm.entry.senderId = vm.app.senderId;
      modalService.confirm({
        title: 'APP.LIST.MODAL.DELETE.TITLE',
        text: 'APP.LIST.MODAL.DELETE.TEXT',
        translationContext: {title: vm.entry.name},
        close: {
          title: 'YES',
          style: 'btn-danger'
        },
        dismiss: {title: 'NO'}
      }).result.then(function () {
        vm.entry.delete().then(function () {
          _loadData();
        });
      });
    }

    function showCreateEntryForm() {
      return !vm.app._permissions.readEntries && vm.app._permissions.createEntry && vm.fields.length > 0;
    }

    function _loadData() {
      if (!vm.app._permissions.readEntries) {
        return;
      }

      vm.loading = true;
      var context = {
        senderId: app.senderId,
        appId: app.id
      };
      var pageable = new Pageable((vm.currentPage ? vm.currentPage.number : 0), 20, sortQuery);
      var queryParams = angular.extend({query: vm.search, _permissions: 'edit,delete'}, pageable.getParams());
      ListEntryModel.pagedQuery(pageable, queryParams, context).then(function (result) {
        vm.currentPage = result;
        listService.initEntries(vm.currentPage.content, vm.fields);
      }).finally(function () {
        vm.loading = false;
      });
    }

    function _updateAppPermissions() {
      app.getWithPermissions('', {}, ['createEntry']).then(function (result) {
        if (result._permissions) {
          angular.extend(app._permissions, result._permissions);
        }
      });
    }

  }
})(angular);
