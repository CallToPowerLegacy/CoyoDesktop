(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ConfigureFieldsController', ConfigureFieldsController);

  function ConfigureFieldsController(ListFieldModel, createFieldModalService, editFieldModalService, fieldTypeRegistry,
                                     modalService, fields, app) {
    var vm = this;

    vm.fields = fields;
    vm.elementName = app.settings.elementName;

    vm.$onInit = init;
    vm.getIcon = getIcon;
    vm.getFieldType = getFieldType;
    vm.createField = createField;
    vm.editField = editField;
    vm.deleteField = deleteField;
    vm.treeOptions = _buildTreeOptions();

    function init() {
      vm.fieldTypes = fieldTypeRegistry.getAll();
    }

    function getIcon(key) {
      return fieldTypeRegistry.get(key).icon;
    }

    function getFieldType(key) {
      return fieldTypeRegistry.get(key).title;
    }

    function createField() {
      createFieldModalService.open(app).then(function (field) {
        vm.fields.push(field);
      });
    }

    function editField(field) {
      editFieldModalService.open(field).then(function (field) {
        var index = _.findIndex(vm.fields, {id: field.id});
        if (index > -1) {
          vm.fields[index] = field;
        }
      });
    }

    function deleteField(field) {
      modalService.confirm({
        title: 'APP.LIST.FIELD.MODAL.DELETE.TITLE',
        text: 'APP.LIST.FIELD.MODAL.DELETE.TEXT',
        translationContext: {name: field.name},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        field.remove().then(function () {
          var index = _.findIndex(vm.fields, {id: field.id});
          if (index > -1) {
            vm.fields.splice(index, 1);
          }
        });
      });
    }

    function _buildTreeOptions() {
      return {
        dropped: function (event) {
          // persist new sort order
          if (event.source.index !== event.dest.index) {
            ListFieldModel.order(app.id, app.senderId, _.map(vm.fields, 'id'));
          }
        }
      };
    }

  }
})(angular);
