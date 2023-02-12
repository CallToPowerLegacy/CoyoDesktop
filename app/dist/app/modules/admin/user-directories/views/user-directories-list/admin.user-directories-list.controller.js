(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .controller('AdminUserDirectoriesListController', AdminUserDirectoriesListController);

  function AdminUserDirectoriesListController($rootScope, $scope, $sessionStorage, $translate, UserDirectoryModel,
                                              userDirectoryTypeRegistry, modalService, filterFilter) {
    var vm = this;
    var userDirectories = [];
    var internalUserDirectoryName = $translate.instant('ADMIN.USER_DIRECTORIES.INTERNAL.INSTANCE.NAME');

    vm.userDirectories = null;
    vm.internalUserDirectory = {
      id: 'INTERNAL',
      name: internalUserDirectoryName,
      displayName: internalUserDirectoryName,
      type: 'internal',
      active: true
    };
    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.actions = _buildActions();

    vm.onChangeName = onChangeName;
    vm.getTypeName = getTypeName;

    function onChangeName(term) {
      $sessionStorage.userDirectoryList = {name: term};
      vm.isFiltered = !!term;
      vm.userDirectories = term ? filterFilter(userDirectories, $sessionStorage.userDirectoryList) : userDirectories;
    }

    function getTypeName(key) {
      return key === vm.internalUserDirectory.type ? 'ADMIN.USER_DIRECTORIES.INTERNAL.NAME' : userDirectoryTypeRegistry.get(key).name;
    }

    // ----------

    function _buildActions() {
      return {
        activate: function (userDirectory) {
          vm.userAction = true;
          userDirectory.activate().then(function () {
            userDirectory.active = true;
          }).finally(function () {
            vm.userAction = false;
          });
        },
        deactivate: function (userDirectory) {
          vm.userAction = true;
          userDirectory.deactivate().then(function () {
            userDirectory.active = false;
          }).finally(function () {
            vm.userAction = false;
          });
        },
        deleteDirectory: function (userDirectory) {
          modalService.confirm({
            title: 'ADMIN.USER_DIRECTORIES.OPTIONS.DELETE.MODAL.TITLE',
            text: 'ADMIN.USER_DIRECTORIES.OPTIONS.DELETE.MODAL.TEXT',
            close: {title: 'YES'},
            dismiss: {title: 'NO'}
          }).result.then(function () {
            vm.userAction = true;
            userDirectory.delete().then(function () {
              _.remove(userDirectories, {id: userDirectory.id});
              _.remove(vm.userDirectories, {id: userDirectory.id});
            }).finally(function () {
              vm.userAction = false;
            });
          });
        }
      };
    }

    // ----------

    (function _init() {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.loading = true;
      vm.queryParams = angular.extend({name: ''}, $sessionStorage.userDirectoryList);
      return UserDirectoryModel.query().then(function (result) {
        userDirectories = result;
        userDirectories.unshift(vm.internalUserDirectory);
        onChangeName(vm.queryParams.name);
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }
})(angular);
