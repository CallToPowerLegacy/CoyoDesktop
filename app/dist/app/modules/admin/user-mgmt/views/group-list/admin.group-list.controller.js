(function (angular) {
  'use strict';

  angular.module('coyo.admin.userManagement')
      .controller('AdminGroupListController', AdminGroupListController);

  function AdminGroupListController($rootScope, $scope, GroupModel, $sessionStorage, Pageable, modalService) {
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
      _queryParams: $sessionStorage.groupList || {
        _page: 0,
        _orderBy: 'displayName'
      }
    };

    if (vm.mobile) {
      vm.page._queryParams._page = 0;
    }

    vm.nextPage = nextPage;
    vm.nameChanged = nameChanged;

    vm.actions = {
      deleteGroup: function (group) {
        modalService.confirm({
          title: 'ADMIN.USER_MGMT.GROUPS.OPTIONS.DELETE.MODAL.TITLE',
          text: 'ADMIN.USER_MGMT.GROUPS.OPTIONS.DELETE.MODAL.TEXT',
          translationContext: {userCount: group.userCount},
          close: {title: 'YES'},
          dismiss: {title: 'NO'}
        }).result.then(function () {
          vm.userAction = true;
          group.delete().then(function () {
            return initialLoad();
          }).finally(function () {
            vm.userAction = false;
          });
        });
      }
    };

    function initialLoad() {
      vm.page.loading = true;
      var pageable = new Pageable(vm.page._queryParams._page, vm.page._queryParams._pageSize, vm.page._queryParams._sort);
      return GroupModel.pagedQuery(pageable, vm.page._queryParams).then(function (result) {
        vm.page = result;
        vm.page._queryParams._page = result.number;
        $sessionStorage.groupList = vm.page._queryParams;
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

    function nameChanged(term) {
      vm.page._queryParams.displayName = term;
      vm.page.page(0);
    }

    (function initController() {
      initPageSize();
      initialLoad();
    })();
  }

})(angular);
