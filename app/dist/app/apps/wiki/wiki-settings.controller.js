(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .controller('WikiSettingsController', WikiSettingsController);

  function WikiSettingsController($scope) {
    var vm = this;

    vm.$onInit = onInit;
    vm.setAppFolderPermissions = setAppFolderPermissions;

    vm.app = $scope.model;
    vm.app.settings.editorType = _.getNullUndefined(vm, 'app.settings.editorType', 'VIEWER');
    vm.app.settings.commentsAllowed = _.getNullUndefined(vm, 'app.settings.commentsAllowed', false);

    function setAppFolderPermissions() {
      _.set(vm.app.settings, 'folderPermissions.modifyRole', vm.app.settings.editorType);
    }

    function onInit() {
      vm.setAppFolderPermissions();
    }
  }

})(angular);
