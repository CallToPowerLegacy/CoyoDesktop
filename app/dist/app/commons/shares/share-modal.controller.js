(function (angular) {
  'use strict';

  angular
      .module('commons.shares')
      .controller('ShareModalController', shareModalController);

  function shareModalController(authService, parentIsPublic) {
    var vm = this;
    vm.senderChooserParams = {
      'allowedTypeNames': ['user', 'page', 'workspace', 'event'],
      'findSharingRecipients': true,
      'findOnlyManagedSenders': true
    };
    vm.parentIsPublic = parentIsPublic;

    vm.$onInit = init;

    function init() {
      authService.getUser().then(function (user) {
        vm.author = user;
      });
    }
  }

})(angular);
