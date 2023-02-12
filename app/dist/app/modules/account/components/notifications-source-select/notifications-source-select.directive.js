(function () {
  'use strict';

  angular
      .module('coyo.account')
      .component('oyocNotificationsSourceSelect', notificationsSourceSelect())
      .controller('NotificationsSourceSelectController', NotificationsSourceSelectController);

  /**
   * @ngdoc directive
   * @name coyo.account.oyocNotificationsSourceSelect:oyocNotificationsSourceSelect
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the options for the browser notification settings of users.
   *
   * @param {object} setting The settings object to display the form for
   * @param {array} notificationSources The notification sources to choose from
   * @param {function} onSelectionChange callback function to be executed on selection change
   *
   */
  function notificationsSourceSelect() {
    return {
      templateUrl: 'app/modules/account/components/notifications-source-select/notifications-source-select.html',
      bindings: {
        setting: '=',
        notificationSources: '=',
        onSelectionChange: '&'
      },
      controller: 'NotificationsSourceSelectController'
    };
  }

  function NotificationsSourceSelectController() {
    var vm = this;

    vm.$onInit = onInit;

    vm.onChange = vm.onSelectionChange || angular.noop;

    function onInit() {
      _(vm.notificationSources).forEach(function (source) {
        _checkProperty(vm.setting.properties, 'notifications.' + source, true);
      });
    }

    function _checkProperty(obj, prop, val) {
      if (angular.isUndefined(_.get(obj, prop))) {
        _.set(obj, prop, val);
      }
    }
  }
})();
