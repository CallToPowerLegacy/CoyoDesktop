(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocFieldSettings', fieldSettings())
      .controller('FieldSettingsController', FieldSettingsController);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.fieldSettings:fieldSettings
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the settings for a given field and field type. If an empty field is passed a new one is created based
   * on the passed type.
   *
   * @param {object} field
   * The field to display the settings for or an empty object to store the new field (including its settings) in.
   *
   * @param {object} fieldType
   * The field type of the field to display the settings for.
   *
   * @requires coyo.apps.list.ListFieldModel
   *
   */
  function fieldSettings() {
    return {
      templateUrl: 'app/apps/list/components/field-settings.html',
      bindings: {
        field: '=',
        fieldType: '<',
        formCtrl: '<'
      },
      controller: 'FieldSettingsController',
      controllerAs: '$ctrl'
    };
  }

  function FieldSettingsController(ListFieldModel) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      if (_.isEmpty(vm.field)) {
        vm.field = ListFieldModel.fromConfig(vm.fieldType);
      }
    }
  }
})();
