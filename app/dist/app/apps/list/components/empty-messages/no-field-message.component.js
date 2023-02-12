(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocNoFieldsMessage', noFieldsMessage());

  /**
   * @ngdoc directive
   * @name coyo.apps.list.noFieldsMessage:noFieldsMessage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a message to the user based on his or her permissions that no fields were created, yet. If the user has
   * the permission to create fields (manageApp) a button to create a new field is displayed along with the message.
   *
   * @param {boolean} managePermission
   * The permission defining whether the user can manage the list app or not. This is needed to display the correct
   * message.
   *
   * @param {function} createFn
   * The function to create a new field needs to be passed to render a button if the user has sufficient permissions.
   */
  function noFieldsMessage() {
    return {
      templateUrl: 'app/apps/list/components/empty-messages/no-field-message.html',
      bindings: {
        managePermission: '<',
        createFn: '&'
      }
    };
  }
})();
