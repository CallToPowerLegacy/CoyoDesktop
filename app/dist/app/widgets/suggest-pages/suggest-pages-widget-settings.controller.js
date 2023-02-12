(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.suggestpages')
      .controller('SuggestPagesWidgetSettingsController', SuggestPagesWidgetSettingsController);

  function SuggestPagesWidgetSettingsController($scope, PageModel) {
    var vm = this;
    vm.model = $scope.model;
    vm.ableToLoadAllPages = true;
    vm.loading = true;

    $scope.$watch(function () { return vm.model.selectedPages; }, function (newVal, oldVal) {
      if (oldVal !== newVal) {
        vm.model.settings._pageIds = _.map(vm.model.selectedPages, function (page) {
          return '' + page.id;
        });
      }
    });

    (function _init() {
      if (!vm.model.settings._pageIds) {
        vm.loading = false;
        return;
      }

      PageModel.$get(PageModel.$url(), {pageIds: vm.model.settings._pageIds}).then(function (res) {
        vm.model.selectedPages = res;
        vm.ableToLoadAllPages = vm.model.settings._pageIds.length === vm.model.selectedPages.length;
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
