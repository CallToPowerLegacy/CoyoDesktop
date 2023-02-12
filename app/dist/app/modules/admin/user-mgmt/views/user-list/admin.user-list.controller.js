(function (angular) {
  'use strict';

  angular.module('coyo.admin.userManagement')
      .controller('AdminUserListController', AdminUserListController);

  function AdminUserListController($rootScope, $scope, UserModel, modalService, $sessionStorage, settings) {

    var vm = this;
    vm.firstLoad = true;

    // need to know about screen size in ctrl to turn off infinite scrolling in desktop mode
    var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
      // move back to first page when switching between mobile and desktop view
      var isMobile = screenSize.isXs || screenSize.isSm;
      if (isMobile !== vm.mobile && vm.page._queryParams._page > 0) {
        vm.page.page(0);
      }
      vm.mobile = isMobile;
      initPageSize();
    });
    $scope.$on('$destroy', unsubscribe);

    vm.mobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

    vm.page = {
      content: [],
      _queryParams: $sessionStorage.userList || {
        _page: 0,
        _orderBy: 'lastname.sort,firstname.sort',
        displayName: '',
        status: 'ACTIVE'
      }
    };

    if (vm.mobile) {
      vm.page._queryParams._page = 0;
    }

    vm.filter = {
      status: {
        options: [
          {labelKey: 'ADMIN.USER_MGMT.USERS.FILTER.ALL', value: null, icon: 'zmdi-check-all'},
          {labelKey: 'ADMIN.USER_MGMT.USERS.FILTER.ACTIVE', value: 'ACTIVE', icon: 'zmdi-play'},
          {labelKey: 'ADMIN.USER_MGMT.USERS.FILTER.INACTIVE', value: 'INACTIVE', icon: 'zmdi-stop'},
          {labelKey: 'ADMIN.USER_MGMT.USERS.FILTER.HIDDEN', value: 'HIDDEN', icon: 'zmdi-grid-off'},
          {labelKey: 'ADMIN.USER_MGMT.USERS.FILTER.DELETED', value: 'DELETED', icon: 'zmdi-delete'}
        ],
        changed: function (value) {
          vm.page._queryParams.status = value;
          return vm.page.page(0);
        }
      },
      displayName: {
        changed: function (searchTerm) {
          vm.page._queryParams.displayName = searchTerm;
          return vm.page.page(0);
        }
      }
    };

    vm.nextPage = nextPage;

    vm.actions = {
      deleteUser: function (user) {
        var modalAnonymizationWarning = 'ADMIN.USER_MGMT.USERS.OPTIONS.DELETE.MODAL.ANONYMIZATION_HINT';
        var confirmOptions = {
          okButtonStyle: 'btn-danger',
          okButtonText: 'DELETE',
          translationContext: {
            displayName: user.displayName
          },
          text: settings.deletedUserAnonymizationActive === 'true' ? modalAnonymizationWarning : undefined
        };

        userRowAction('delete', user, true, confirmOptions);
      },
      recoverUser: function (user) {
        userRowAction('recover', user, true, false);
      },
      activateUser: function (user) {
        userRowAction('activate', user, false, false);
      },
      deactivateUser: function (user) {
        userRowAction('deactivate', user, false, false);
      }
    };

    function initialLoad() {
      vm.page.loading = true;
      return UserModel.searchWithAdminFields(vm.page._queryParams).then(function (result) {
        vm.page = result;
        vm.page._queryParams._page = result.number;
        $sessionStorage.userList = vm.page._queryParams;
      }).finally(function () {
        vm.page.loading = false;
        vm.firstLoad = false;
      });
    }

    function initPageSize() {
      vm.page._queryParams._pageSize = vm.mobile ? 30 : 10;
    }

    function nextPage() {
      if (vm.page.content.length === 0 || vm.page.last || vm.page.loading) {
        return;
      }
      vm.page.nextAppended();
    }

    function userRowAction(action, user, confirm, options) {
      function performAction() {
        vm.userAction = true;
        user[action]().then(function () {
          return initialLoad();
        }).finally(function () {
          vm.userAction = false;
        });
      }

      if (confirm) {
        var key = action.toUpperCase();
        modalService.confirm({
          title: 'ADMIN.USER_MGMT.USERS.OPTIONS.' + key + '.MODAL.TITLE',
          text: _.get(options, 'text', 'ADMIN.USER_MGMT.USERS.OPTIONS.' + key + '.MODAL.TEXT'),
          close: {
            title: _.get(options, 'okButtonText', 'YES'),
            style: _.get(options, 'okButtonStyle', 'btn btn-primary')
          },
          dismiss: {
            title: 'NO'
          },
          translationContext: _.get(options, 'translationContext')
        }).result.then(performAction);
      } else {
        performAction();
      }
    }

    (function initController() {
      initPageSize();
      initialLoad();
    })();
  }

})(angular);
