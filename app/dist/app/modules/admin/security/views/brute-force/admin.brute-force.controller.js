(function (angular) {
  'use strict';

  angular.module('coyo.admin.security')
      .controller('AdminBruteForceSecurityController', AdminBruteForceSecurityController);

  function AdminBruteForceSecurityController($rootScope, $scope, coyoNotification, SettingsModel, settings, UserModel) {
    var vm = this;

    vm.settings = settings;
    vm.save = save;

    vm.page = {
      content: [],
      _queryParams: {
        _page: 0,
        _orderBy: 'displayName.sort,asc',
        _pageSize: 10,
        displayName: ''
      }
    };

    vm.filter = {
      displayName: {
        changed: function (searchTerm) {
          vm.page._queryParams.displayName = searchTerm;
          return vm.page.page(0);
        }
      }
    };

    vm.actions = {
      unblockUser: unblockUser
    };

    vm.nextPage = nextPage;

    // need to know about screen size in ctrl to turn off infinite scrolling in desktop mode
    var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
      // move back to first page when switching between mobile and desktop view
      var isMobile = screenSize.isXs || screenSize.isSm;
      if (isMobile !== vm.mobile && vm.page._queryParams._page > 0) {
        vm.page.page(0);
      }
      vm.mobile = isMobile;
    });
    $scope.$on('$destroy', unsubscribe);

    vm.mobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

    function initialLoad() {
      vm.page.loading = true;
      return UserModel.searchBlocked(vm.page._queryParams).then(function (result) {
        vm.page = result;
        vm.page._queryParams._page = result.number;
      }).finally(function () {
        vm.page.loading = false;
        vm.firstLoad = false;
      });
    }

    function nextPage() {
      if (vm.page.content.length === 0 || vm.page.last || vm.page.loading) {
        return;
      }
      vm.page.nextAppended();
    }

    function unblockUser(user) {
      user.unblock().then(function () {
        return initialLoad();
      });
    }

    function save() {
      return settings.update().then(function () {
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      });
    }

    (function initController() {
      initialLoad();
    })();
  }

})(angular);
