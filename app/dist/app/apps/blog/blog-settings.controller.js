(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .controller('BlogSettingsController', BlogSettingsController);

  function BlogSettingsController($scope) {
    var vm = this;
    vm.$onInit = onInit;
    vm.setAppFolderPermissions = setAppFolderPermissions;

    vm.app = $scope.model;
    vm.app.settings.authorType = _.getNullUndefined(vm, 'app.settings.authorType', 'ADMIN');
    vm.app.settings.publisherType = _.getNullUndefined(vm, 'app.settings.publisherType', 'ADMIN');
    vm.app.settings.commentsAllowed = _.getNullUndefined(vm, 'app.settings.commentsAllowed', true);

    function setAppFolderPermissions() {
      if (vm.app.settings.authorType === 'BLOGAPP_LIST_OF_USERS') {
        _.set(vm.app.settings, 'folderPermissions.modifyRole', undefined);
        _.set(vm.app.settings, 'folderPermissions.users', vm.app.settings.authorIds);
      } else {
        _.set(vm.app.settings, 'folderPermissions.modifyRole', vm.app.settings.authorType);
      }
    }

    function onInit() {
      vm.setAppFolderPermissions();
    }
  }

})(angular);
