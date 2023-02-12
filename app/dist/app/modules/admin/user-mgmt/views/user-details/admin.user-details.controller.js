(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .controller('AdminUserDetailsController', AdminUserDetailsController);

  function AdminUserDetailsController($state, $translate, authService, user) {
    var vm = this;

    vm.user = user;
    vm.groups = user.groups;
    vm.roles = user.roles;
    vm.remoteUserDirectory = user.remoteUserDirectory
      ? {id: user.remoteUserDirectory.id, displayName: user.remoteUserDirectory.name} : null;

    vm.save = save;
    vm.handleActiveChanged = handleActiveChanged;
    vm.handleWelcomeMailChanged = handleWelcomeMailChanged;
    vm.handleGeneratePasswordChanged = handleGeneratePasswordChanged;
    vm.hasRemoteUserIdWarning = hasRemoteUserIdWarning;
    vm.hasRemoteDirectoryChangedWarning = hasRemoteDirectoryChangedWarning;
    vm.hasRemoteDirectoryRemovedWarning = hasRemoteDirectoryRemovedWarning;

    function save() {
      vm.user.groupIds = _.map(vm.groups, 'id');
      vm.user.roleIds = _.map(vm.roles, 'id');
      vm.user.remoteUserDirectoryId = _.get(vm, 'remoteUserDirectory.id');
      // if password is empty delete the property and don't transfer it. Otherwise it would be considered invalid.
      if (_.isEmpty(vm.user.password)) {
        delete vm.user.password;
      }
      return vm.user.isNew()
        ? vm.user.create().then(onSuccess)
        : vm.user.update().then(onSuccess);

      function onSuccess() {
        $state.go('^');
      }
    }

    function handleActiveChanged() {
      vm.user.welcomeMail = false;
      vm.user.generatePassword = false;
    }

    function handleWelcomeMailChanged() {
      vm.user.generatePassword = false;
    }

    function handleGeneratePasswordChanged() {
      vm.user.password = '';
    }

    function hasRemoteUserIdWarning() {
      return !!(vm.user.remoteUserId !== vm.oldRemoteUserId
          && vm.oldRemoteUserId
          && vm.user.remoteUserId
          && vm.remoteUserDirectory);
    }

    function hasRemoteDirectoryChangedWarning() {
      return !!(_.get(vm, 'remoteUserDirectory.id') !== vm.oldRemoteUserDirectoryId
          && !vm.user.isNew()
          && vm.remoteUserDirectory);
    }

    function hasRemoteDirectoryRemovedWarning() {
      return _.get(vm, 'remoteUserDirectory.id') !== vm.oldRemoteUserDirectoryId
          && !vm.remoteUserDirectory;
    }

    (function _init() {
      if (!vm.user.isNew()) {
        $translate('ADMIN.USER_MGMT.USERS.DETAILS.PASSWORD_UPDATE_HINT').then(function (text) {
          vm.passwordPlaceholder = text;
        });
        if (vm.user.status === 'HIDDEN') {
          vm.user.active = true;
        }
      }

      authService.getUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });

      vm.oldRemoteUserId = vm.user.remoteUserId;
      vm.oldRemoteUserDirectoryId = _.get(vm.user, 'remoteUserDirectory.id');
      vm.baseUrl = $state.href('main.profile', {});
      vm.oldSlug = user.slug;
    })();
  }

})(angular);
