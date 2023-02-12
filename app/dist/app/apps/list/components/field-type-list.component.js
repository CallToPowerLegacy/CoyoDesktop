(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocFieldTypeList', fieldTypeList())
      .controller('FieldTypeListController', FieldTypeListController);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.fieldTypeList:fieldTypeList
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a list of all registered field types with the icon, name and description. A user can select a field type
   * which is then stored in the fieldType parameter.
   *
   * @param {object} fieldType
   * This paremter is used to store the selected field type
   *
   * @requires coyo.apps.list.fields.fieldTypeRegistry
   *
   */
  function fieldTypeList() {
    return {
      templateUrl: 'app/apps/list/components/field-type-list.html',
      bindings: {
        fieldType: '='
      },
      controller: 'FieldTypeListController',
      controllerAs: '$ctrl'
    };
  }

  function FieldTypeListController(fieldTypeRegistry) {
    var vm = this;
    vm.$onInit = init;
    vm.select = select;

    function init() {
      vm.fieldTypes = fieldTypeRegistry.getAll();
    }

    function select(fieldType) {
      vm.fieldType = fieldType;
    }
  }
})();
