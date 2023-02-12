(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoUserItem', userItem());

  /**
   * @ngdoc directive
   * @name commons.ui.coyoUserItem:coyoUserItem
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a user along with his or her avatar, name and job title. The job title is only displayed when available.
   *
   * @param {object} user
   * The user to display - might not be not null nor undefined. Please make sure that the user is available when
   * calling the directive.
   */
  function userItem() {
    return {
      templateUrl: 'app/commons/ui/components/user-item/user-item.html',
      bindings: {
        user: '<'
      }
    };
  }
})();
