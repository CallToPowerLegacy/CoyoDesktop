(function (angular) {
  'use strict';

  angular.module('coyo.admin.apiClients')
      .controller('AdminApiClientsListController', AdminApiClientsListController);

  function AdminApiClientsListController($rootScope, $scope, $state, ApiClientModel, modalService) {
    var vm = this;

    vm.$onInit = onInit;

    vm.page = null;
    vm.apiClients = null;
    vm.baseUrl = $state.href('main.api-clients', {}) + '/';

    var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
      vm.isMobile = screenSize.isXs || screenSize.isSm;
    });
    $scope.$on('$destroy', unsubscribe);

    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

    vm.actions = {
      deleteApiClient: function (apiClient) {
        modalService.confirm({
          title: 'ADMIN.API_CLIENTS.OPTIONS.DELETE.MODAL.TITLE',
          text: 'ADMIN.API_CLIENTS.OPTIONS.DELETE.MODAL.TEXT',
          translationContext: {clientId: apiClient.clientId},
          close: {title: 'YES'},
          dismiss: {title: 'NO'}
        }).result.then(function () {
          vm.userAction = true;
          apiClient.delete().then(function () {
            return onInit();
          }).finally(function () {
            vm.userAction = false;
          });
        });
      }
    };

    function onInit() {
      vm.loading = true;
      vm.currentPage = {
        _queryParams: {
          _page: _.get(vm.currentPage, '_queryParams._page', 0),
          _pageSize: 20,
          _sort: 'created,desc'
        }
      };

      return ApiClientModel.pagedQuery(null, vm.currentPage._queryParams).then(function (result) {
        vm.currentPage = result;
      }).finally(function () {
        vm.loading = false;
      });

    }
  }

})(angular);
