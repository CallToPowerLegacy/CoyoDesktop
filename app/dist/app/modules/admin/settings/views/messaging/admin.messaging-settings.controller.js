(function (angular) {
  'use strict';

  angular.module('coyo.admin.settings')
      .controller('AdminMessagingSettingsController', AdminMessagingSettingsController);

  function AdminMessagingSettingsController(coyoNotification, SettingsModel, settings) {
    var vm = this;

    vm.$onInit = onInit;
    vm.save = save;
    vm.onDeleteChannelsPeriodChange = onDeleteChannelsPeriodChange;
    vm.onDeleteMessagesPeriodChange = onDeleteMessagesPeriodChange;

    function _parsePeriods() {
      if (vm.settings.deleteChannelsPeriod) {
        vm.settings.deleteChannelsPeriod = parseInt(vm.settings.deleteChannelsPeriod);
      }
      if (vm.settings.deleteMessagesPeriod) {
        vm.settings.deleteMessagesPeriod = parseInt(vm.settings.deleteMessagesPeriod);
      }
    }

    function save() {
      return vm.settings.update().then(function () {
        _parsePeriods();
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      });
    }

    function onDeleteChannelsPeriodChange() {
      var period = parseInt(vm.settings.deleteChannelsPeriod, 10);
      if (period) {
        vm.settings.deleteChannelsPeriod = Math.abs(period);
      }
    }

    function onDeleteMessagesPeriodChange() {
      var period = parseInt(vm.settings.deleteMessagesPeriod, 10);
      if (period) {
        vm.settings.deleteMessagesPeriod = Math.abs(period);
      }
    }

    function _initValues() {
      if (_.isUndefined(vm.settings.deleteChannelsPeriod)) {
        _.set(vm.settings, 'deleteChannelsPeriod', 24);
      }
      if (_.isUndefined(vm.settings.deleteMessagesPeriod)) {
        _.set(vm.settings, 'deleteMessagesPeriod', 72);
      }
      if (_.isUndefined(vm.settings.chatCron)) {
        vm.settings.chatCron = '0 0 * * * *'; // Once every hour
      }
    }

    function onInit() {
      vm.settings = settings;

      _initValues();
      _parsePeriods();
    }
  }

})(angular);
