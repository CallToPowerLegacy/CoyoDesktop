(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocListAppMessage', listAppMessage());

  function listAppMessage() {
    return {
      bindings: {
        icon: '@',
        message: '@'
      },
      templateUrl: 'app/apps/list/components/empty-messages/list-app-message.html'
    };
  }

})();
