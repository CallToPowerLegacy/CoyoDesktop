(function () {
  'use strict';

  angular
      .module('coyo.pages')
      .component('oyocPageAutoSubscribeSettings', pageAutoSubscribeSettings())
      .controller('PageAutoSubscribeSettingsController', PageAutoSubscribeSettingsController);

  function pageAutoSubscribeSettings() {
    return {
      controller: 'PageAutoSubscribeSettingsController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/pages/components/auto-subscribe-settings/page-auto-subscribe-settings.html',
      bindings: {
        page: '='
      }
    };
  }

  function PageAutoSubscribeSettingsController() {
    var vm = this;

    vm.onSelectionChange = onSelectionChange;

    function onSelectionChange() {
      if (vm.page.autoSubscribeType !== 'SELECTED') {
        vm.page.autoSubscribeUserIds = [];
        vm.page.autoSubscribeGroupIds = [];
      }
    }
  }
})();
