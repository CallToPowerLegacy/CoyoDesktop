(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('coyoListValue', listValue());

  /**
   * @ngdoc directive
   * @name coyo.apps.list.coyoListValue:coyoListValue
   * @element OWN
   *
   * @description
   * Decides if a list value is to be rendered or displayed as an inline edit
   *
   * @param {object} app
   * App object needed for creating the context for saving the value in the inline edit.
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
   */
  function listValue() {
    return {
      bindings: {
        app: '<',
        entry: '=',
        field: '<',
        onSave: '<?'
      },
      templateUrl: 'app/apps/list/components/list-value.html',
      controller: 'ListValueController'
    };
  }

})();
