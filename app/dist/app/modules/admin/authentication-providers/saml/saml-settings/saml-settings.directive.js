(function (angular) {
  'use strict';

  angular.module('coyo.admin.authenticationProviders.saml')
      .component('oyocSamlSettings', samlSettings())
      .controller('SamlSettingsController', SamlSettingsController);

  /**
   * @ngdoc directive
   * @name coyo.admin.authenticationProviders.saml.oyocSamlSettings:oyocSamlSettings
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the form fields of a SAML authentication provider.
   */
  function samlSettings() {
    return {
      require: 'ngModel',
      controller: 'SamlSettingsController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/authentication-providers/saml/saml-settings/saml-settings.html',
      bindings: {
        form: '<',
        ngModel: '='
      }
    };
  }

  function SamlSettingsController($scope, CapabilitiesModel) {
    var vm = this;
    vm.oldSlug = vm.ngModel.slug;
    vm.availableLogoutMethods = ['UNKNOWN'];

    var deregisterFn = $scope.$on('authenticationProviderFieldErrors', function (event, errorDetails) {
      vm.errorMessage = errorDetails[0].message;
      vm.signingCertificateError = angular.isDefined(_.find(errorDetails, {key: 'signingCertificate'}));
      vm.signingPrivateKeyError = angular.isDefined(_.find(errorDetails, {key: 'signingPrivateKey'}));
      vm.idpTrustAnchorError = angular.isDefined(_.find(errorDetails, {key: 'idpTrustAnchor'}));
    });
    $scope.$on('$destroy', deregisterFn);

    (function _init() {
      CapabilitiesModel.authProviderCapabilities('saml').then(function (samlCapabilities) {
        vm.availableLogoutMethods =
            _.isArray(samlCapabilities.logoutMethods) ? samlCapabilities.logoutMethods : ['UNKNOWN'];
      });
    })();
  }
})(angular);
