(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocUserChooserItem', userChooserItem)
      .controller('UserChooserItemController', UserChooserItemController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocUserChooserItem:oyocUserChooserItem
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a list item for a user or group in the user chooser.
   *
   * @param {object} item A user or user group.
   * @param {string} itemType The item type, either "item" or "group".
   * @param {boolean} selected 'true' if the item is currently selected.
   */
  function userChooserItem() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/user-chooser-item/user-chooser-item.html',
      bindToController: {
        item: '<',
        itemType: '@',
        selectionType: '<?',
        fields: '<?'
      },
      controller: 'UserChooserItemController as $ctrl'
    };
  }

  function UserChooserItemController(profileFieldTemplates) {
    var vm = this;
    vm.getConfig = getConfig;
    function getConfig(type) {
      return profileFieldTemplates[type];
    }
  }

})(angular);
