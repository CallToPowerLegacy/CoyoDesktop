(function (angular) {
  'use strict';

  angular.module('coyo.admin.authenticationProviders.oauth2')
      .component('oyocOauth2Settings', oauth2Settings())
      .controller('Oauth2SettingsController', Oauth2SettingsController);

  /**
   * @ngdoc directive
   * @name coyo.admin.authenticationProviders.oauth2.oyocOauth2Settings:oyocOauth2Settings
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the form fields of an Oauth2 authentication provider.
   */
  function oauth2Settings() {
    return {
      require: 'ngModel',
      controller: 'Oauth2SettingsController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/authentication-providers/oauth2/oauth2-settings/oauth2-settings.html',
      bindings: {
        form: '<',
        ngModel: '='
      }
    };
  }

  function Oauth2SettingsController(OAUTH2_PRESETS) {
    var vm = this;
    vm.oldSlug = vm.ngModel.slug;
    vm.schemas = ['header', 'query', 'form', 'none'];
    vm.presets = [
      {name: 'Office 365', properties: OAUTH2_PRESETS.office365},
      {name: 'Facebook', properties: OAUTH2_PRESETS.facebook}
    ];
    vm.selectPreset = selectPreset;

    if (!vm.ngModel.properties) {
      vm.ngModel.properties = {};
      selectPreset(false);
    }

    function selectPreset(preset) {
      angular.extend(vm.ngModel.properties, preset ? preset.properties : OAUTH2_PRESETS.empty);
    }
  }

})(angular);
