(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders')
      .component('oyocAuthenticationProviderSettings', authenticationProviderSettings())
      .controller('AuthenticationProviderSettingsController', AuthenticationProviderSettingsController);

  /**
   * @ngdoc directive
   * @name coyo.admin.authenticationProviders.oyocAuthenticationProviderSettings:oyocAuthenticationProviderSettings
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the settings form of the given authentication provider.
   *
   * @param {string} type
   * The type of the authentication provider to display the settings for.
   * @param {object} form
   * The authentication provider form.
   * @param {object} settings
   * The settings of the authentication provider to display the settings for.
   * @param {object} extendedInfo
   * Any additional (read-only) properties calculated by the backend that are needed (e.g. for displaying urls etc)
   *
   * @requires $compile
   * @requires coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
   */
  function authenticationProviderSettings() {
    return {
      scope: {},
      controller: 'AuthenticationProviderSettingsController',
      controllerAs: '$ctrl',
      template: '<div></div>',
      bindings: {
        form: '<',
        provider: '='
      }
    };
  }

  function AuthenticationProviderSettingsController($compile, $element, $scope, authenticationProviderTypeRegistry) {
    var vm = this;

    var initSettings = angular.copy(vm.provider.properties);
    var allSettings = {};

    $scope.$watch(function () {
      return vm.provider.type;
    }, function (newVal, oldVal) {
      if (!newVal) {
        return;
      }
      if (oldVal) {
        allSettings[oldVal] = angular.copy(vm.provider.properties);
      }
      _.set(vm, 'provider.properties', allSettings[newVal] || angular.copy(initSettings));

      var authenticationProvider = authenticationProviderTypeRegistry.get(newVal);
      var childDirective = angular.element('<' + authenticationProvider.directive + ' ng-model="$ctrl.provider" form="$ctrl.form"></' + authenticationProvider.directive + '>');
      $element.html(childDirective);
      $compile($element.contents())($scope);
    });
  }

})(angular);
