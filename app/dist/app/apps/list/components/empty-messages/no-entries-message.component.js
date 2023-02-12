(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocNoEntriesMessage', noEntriesMessage());

  /**
   * @ngdoc directive
   * @name coyo.apps.list.noEntriesMessage:noEntriesMessage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a message to the user based on his or her permissions that no entries were created, yet. If the user has
   * the permission to create entries (manageApp) a button to create a new entry is displayed along with the message.
   *
   * @param {function} createPermission
   * The permission defining whether the user can create list entries or not. This is needed to display the create
   * button if applicable.
   *
   * @param {function} createFn
   * The function to create a new list entry needs to be passed to render a button if the user has sufficient permissions.
   */
  function noEntriesMessage() {
    return {
      templateUrl: 'app/apps/list/components/empty-messages/no-entries-message.html',
      bindings: {
        createPermission: '<',
        createFn: '&'
      }
    };
  }
})();
