(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocEntryForm', entryForm())
      .controller('EntryFormController', EntryFormController);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.oyocEntryForm:oyocEntryForm
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   *
   * @param {object} entry
   * The model object for an entry that stores all values that belong to the list entry.3
   *
   * @param {array} fields
   * Field array that contains all fields that belong to the app. A concrete field consists of properties like id, name,
   * required, hidden and field type specific settings.
   *
   */
  function entryForm() {
    return {
      templateUrl: 'app/apps/list/components/entry-form.html',
      bindings: {
        entry: '=',
        fields: '<',
        formCtrl: '<'
      },
      controller: 'EntryFormController',
      controllerAs: '$ctrl'
    };
  }

  function EntryFormController($scope, fieldTypeRegistry, listService) {
    var vm = this;

    vm.$onInit = init;
    vm.getFieldValue = getFieldValue;
    vm.getFieldConfig = getFieldConfig;
    vm.showInitialValidationErrors = showInitialValidationErrors;

    function init() {
      $scope.$watch(function () {
        return vm.entry;
      }, _initEntry, true);

      vm.formCtrl.getFieldName = function (field) {
        return 'field-' + field.id;
      };

      vm.formCtrl.getField = function (field) {
        return vm.formCtrl[vm.formCtrl.getFieldName(field)];
      };
    }

    function getFieldConfig(field) {
      return angular.merge(field, fieldTypeRegistry.get(field.key));
    }

    function getFieldValue(fieldId) {
      return listService.getFieldValue(vm.entry, fieldId);
    }

    function showInitialValidationErrors(field) {
      var fieldCtrl = vm.formCtrl.getField(field);
      return !vm.entry.isNew() || fieldCtrl && fieldCtrl.$dirty;
    }

    function _initEntry() {
      vm.entry = listService.initEntry(vm.entry, vm.fields);
    }

  }
})();
