(function () {
  'use strict';

  angular
      .module('coyo.account')
      .component('oyocNotificationsIntervalSelect', notificationsIntervalSelect())
      .controller('NotificationsIntervalSelectController', NotificationsIntervalSelectController);

  /**
   * @ngdoc directive
   * @name coyo.account.oyocNotificationsIntervalSelect:oyocNotificationsIntervalSelect
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description renders a select-component to pick an interval for notifications
   *
   * @param {object} setting the settings for the notification-channel
   * @param {function=} onSelectionChange optional callback-function to be executed on selection change
   *
   */
  function notificationsIntervalSelect() {
    return {
      templateUrl: 'app/modules/account/components/notifications-interval-select/notifications-interval-select.html',
      bindings: {
        setting: '=',
        onSelectionChange: '&?'
      },
      controller: 'NotificationsIntervalSelectController'
    };
  }

  function NotificationsIntervalSelectController() {
    var vm = this;
    vm.onChange = vm.onSelectionChange || angular.noop;

    vm.items = [
      {value: 'QUARTER_HOURLY', name: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.FORM.INTERVAL.15MN'},
      {value: 'HOURLY', name: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.FORM.INTERVAL.1H'},
      {value: 'FOUR_HOURLY', name: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.FORM.INTERVAL.4H'},
      {value: 'DAILY', name: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.FORM.INTERVAL.1D'},
      {value: 'WEEKLY', name: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.FORM.INTERVAL.1W'}
    ];

  }
})();
