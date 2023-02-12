(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('coyoWidgetStatus', widgetStatus)
      .controller('WidgetStatusController', WidgetStatusController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.coyoWidgetStatus:coyoWidgetStatus
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Handles the loading / error status of widget data retrieval.
   *
   * The provided load callback is triggered immediately after initialization. Before that a loading indicator is
   * displayed and removed after the promise is completed. If the promise results in an error with http status 403
   * (forbidden), an error message is automatically displayed. If the promise resolves to an empty result
   * (or empty array or empty array in the content property), a message indicating no result data is automatically shown.
   *
   * @param {function} loadData callback to load the data. Must return a promise.
   */
  function widgetStatus() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        loadData: '&',
        emptyMessage: '@'
      },
      templateUrl: 'app/widgets/api/components/widget-status/widget-status.html',
      controller: 'WidgetStatusController',
      controllerAs: '$ctrl'
    };
  }

  function WidgetStatusController(errorService, $translate, $scope) {
    var vm = this;
    vm.emptyMessage = vm.emptyMessage || 'WIDGETS.NO_DATA';

    _load();
    var unsubscribeFn = $scope.$on('widgetStatus:refresh', _load);
    $scope.$on('$destroy', unsubscribeFn);

    function _load() {
      vm.loading = true;
      vm.errorMessage = undefined;
      vm.emptyResult = false;

      vm.loadData().then(function (result) {
        if (!result || isEmptyArray(result) || isEmptyArray(result.content)) {
          vm.emptyResult = true;
        }
        return result;
      }).catch(function (errorResponse) {
        errorService.suppressNotification(errorResponse);

        if (errorResponse.status === 403) {
          $translate('WIDGETS.PERMISSION_ERROR').then(function (translation) {
            vm.errorMessage = translation;
          });
        } else {
          errorService.getMessage(errorResponse).then(function (message) {
            vm.errorMessage = message;
          });
        }
        return errorResponse;
      }).finally(function (result) {
        vm.loading = false;
        return result;
      });
    }
  }

  function isEmptyArray(obj) {
    return angular.isArray(obj) && obj.length === 0;
  }

})(angular);
