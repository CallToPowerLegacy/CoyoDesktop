(function (angular) {
  'use strict';

  angular.module('coyo.admin.authenticationProviders')
      .controller('AdminAuthenticationProviderDetailsController', AdminAuthenticationProviderDetailsController);

  function AdminAuthenticationProviderDetailsController($scope, $state, authenticationProvider, errorService, authenticationProviderTypeRegistry) {
    var vm = this;
    vm.authenticationProvider = authenticationProvider;
    vm.save = save;
    vm.$onInit = init;

    function save() {
      vm.invalidSlug = false;
      return vm.authenticationProvider.save().then(function () {
        $state.go('^.list');
      }).catch(function (errorResponse) {
        if (_.get(errorResponse, 'data.errorStatus') === 'SLUG_TAKEN') {
          errorService.suppressNotification(errorResponse);
          vm.invalidSlug = true;
        }
        if (errorResponse.status === 400 && _.get(errorResponse, 'data.fieldErrors', []).length > 0) {
          errorService.suppressNotification(errorResponse);
          $scope.$broadcast('authenticationProviderFieldErrors', errorResponse.data.fieldErrors);
        }
      });
    }

    function init() {
      if (!authenticationProvider.isNew()) {
        vm.oldSlug = authenticationProvider.slug;
      }
      $scope.$watch(function () {
        return vm.authenticationProvider.type;
      }, function (type) {
        if (type) {
          vm.editSlug = authenticationProviderTypeRegistry.get(type).editSlug;
        }
      });
    }
  }
})(angular);
