(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.terms')
      .controller('AdminTermsLogController', AdminTermsLogController);

  function AdminTermsLogController($rootScope, $scope, TermsLogModel, $sessionStorage, Pageable) {
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
      _queryParams: $sessionStorage.termsLogList || {
        _page: 0,
        _orderBy: 'created,desc'
      }
    };

    if (vm.mobile) {
      vm.page._queryParams._page = 0;
    }

    vm.filter = {
      type: {
        options: [
          {labelKey: 'ADMIN.TERMS.LOG.ENTRIES.FILTER.ALL', value: null, icon: 'zmdi-check-all'},
          {labelKey: 'TERMS.LOG.TYPE.ACCEPT', value: 'ACCEPT', icon: 'zmdi-check'},
          {labelKey: 'TERMS.LOG.TYPE.DECLINE', value: 'DECLINE', icon: 'zmdi-block'},
          {labelKey: 'TERMS.LOG.TYPE.ACTIVATED', value: 'ACTIVATED', icon: 'zmdi-play'},
          {labelKey: 'TERMS.LOG.TYPE.DEACTIVATED', value: 'DEACTIVATED', icon: 'zmdi-stop'},
          {labelKey: 'TERMS.LOG.TYPE.NEW_VERSION', value: 'NEW_VERSION', icon: 'zmdi-edit'},
          {labelKey: 'TERMS.LOG.TYPE.RESET', value: 'RESET', icon: 'zmdi-check'}
        ],
        changed: function (value) {
          vm.page._queryParams.type = value;
          return vm.page.page(0);
        }
      },
      userDisplayName: {
        changed: function (searchTerm) {
          vm.page._queryParams.userDisplayName = searchTerm;
          return vm.page.page(0);
        }
      }
    };

    vm.nextPage = nextPage;

    function initialLoad() {
      vm.page.loading = true;
      var pageable = new Pageable(vm.page._queryParams._page, vm.page._queryParams._pageSize, vm.page._queryParams._sort);
      return TermsLogModel.pagedQuery(pageable, vm.page._queryParams).then(function (result) {
        vm.page = result;
        vm.page._queryParams._page = result.number;
        $sessionStorage.termsLogList = vm.page._queryParams;
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

    (function initController() {
      initPageSize();
      initialLoad();
    })();
  }

})(angular);
