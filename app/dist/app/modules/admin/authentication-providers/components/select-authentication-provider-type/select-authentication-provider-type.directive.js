(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders')
      .component('coyoSelectAuthenticationProviderType', selectAuthenticationProviderType())
      .controller('SelectAuthenticationProviderTypeController', SelectAuthenticationProviderTypeController);

  /**
   * @ngdoc directive
   * @name coyo.admin.authenticationProviders.coyoSelectAuthenticationProviderType:coyoSelectAuthenticationProviderType
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for authentication provider type selection.
   *
   * @param {string} placeholder The placeholder for the input field
   * @param {boolean} ngDisabled Marks this field as disabled
   * @param {boolean} allowClear Marks this field as clearable
   *
   * @requires $rootScope
   * @requires $translate
   * @requires coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
   */
  function selectAuthenticationProviderType() {
    return {
      scope: {},
      require: 'ngModel',
      controller: 'SelectAuthenticationProviderTypeController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/authentication-providers/components/select-authentication-provider-type/select-authentication-provider-type.html',
      bindings: {
        placeholder: '@?',
        ngDisabled: '<?',
        allowClear: '<?'
      }
    };
  }

  function SelectAuthenticationProviderTypeController($rootScope, $scope, $element, $translate, authenticationProviderTypeRegistry) {
    var vm = this;
    var ngModelCtrl = $element.controller('ngModel');

    vm.data = {
      providerTypes: [],
      selected: null
    };

    vm.$onInit = _init;

    function _translate() {
      var providerTypes = authenticationProviderTypeRegistry.getAll();
      return $translate(_.flatMap(providerTypes, function (providerType) {
        return [providerType.name, providerType.description];
      })).then(function (data) {
        vm.data.providerTypes = _.map(providerTypes, function (providerType) {
          return angular.extend(providerType, {
            name: data[providerType.name],
            description: data[providerType.description]
          });
        });
      });
    }

    function _init() {
      _translate();

      // translate on language change
      var deregisterFn = $rootScope.$on('$translateChangeSuccess', function () {
        _translate();
      });
      $scope.$on('$destroy', deregisterFn);

      // model -> select
      ngModelCtrl.$render = function () {
        vm.data.selected = ngModelCtrl.$viewValue;
      };

      // select -> model
      $scope.$watch(function () {
        return vm.data.selected;
      }, function (newVal, oldVal) {
        if (newVal !== oldVal) {
          ngModelCtrl.$setViewValue(newVal);
        }
      });
    }
  }

})(angular);
