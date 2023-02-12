(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('coyoListInlineEdit', listInlineEdit());

  /**
   * @ngdoc directive
   * @name coyo.apps.list.coyoListInlineEdit:coyoListInlineEdit
   * @element OWN
   *
   * @description
   * Displays a single value of a list entry in an inline edit manner. I.e. it includes a control referring to the list
   * field config that is responsible for instantly saving the adjusted value.
   *
   * @param {object} app
   * App object needed for creating the context for saving the value.
   *
   * @param {object} entry
   * List entry resource with the value to be displayed.
   *
   * @param {object} field
   * List field corresponding to the list value with needed config information.
   *
   * @param {function} onSave
   * Function called when the list value is saved.
   *
   * @requires coyo.apps.list.api.fieldTypeRegistry

   * @requires coyo.apps.list.listService

   * @requires coyo.apps.list.api.ListEntryModel
   */
  function listInlineEdit() {
    return {
      bindings: {
        app: '<',
        entry: '=',
        field: '<',
        onSave: '<?'
      },
      templateUrl: 'app/apps/list/components/list-inline-edit.html',
      controller: 'ListInlineEditController',
      controllerAs: 'inlineEditCtrl'
    };
  }

})();
