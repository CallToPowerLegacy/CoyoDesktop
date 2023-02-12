(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('coyoListInlineEditCheckbox', listInlineEditCheckbox());

  /**
   * @ngdoc directive
   * @name coyo.apps.list.coyoListInlineEditCheckbox:coyoListInlineEditCheckbox
   * @element OWN
   *
   * @description
   * Decides if a list value of type checkbox is to be displayed as an inline edit or rendered directly. When it is
   * required and true it will be rendered.
   *
   * @param {object} field
   * List field corresponding to the checkbox value with needed config information.
   *
   * @param {function} fieldValue
   * Field value to be updated or rendered.
   */
  function listInlineEditCheckbox() {
    return {
      require: {
        inlineEditCtrl: '^coyoListInlineEdit'
      },
      bindings: {
        field: '<',
        fieldValue: '='
      },
      controller: 'ListInlineEditCheckboxController',
      controllerAs: 'checkboxCtrl',
      templateUrl: 'app/apps/list/fields/inline-edit/list-inline-edit-checkbox.html'
    };
  }

})();
