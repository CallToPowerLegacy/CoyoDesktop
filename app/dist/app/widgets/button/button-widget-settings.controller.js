(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button')
      .controller('ButtonWidgetSettingsController', ButtonWidgetSettingsController);

  function ButtonWidgetSettingsController($scope, buttonWidgetStyleOptions, SettingsModel) {
    var vm = this;
    vm.$onInit = onInit;
    vm.validate = validate;

    function validate() {
      var url = vm.model.settings._url;
      vm.urlValid = _isValidUrl(url);
      if (vm.urlValid) {
        vm.validUrl = url;
      }
    }

    function _isValidUrl(url) {
      return url && url.match(vm.linkPattern) !== null;
    }

    function onInit() {
      vm.model = $scope.model;
      vm.buttonStyles = buttonWidgetStyleOptions;

      vm.model.settings._linkTarget = _.get(vm.model.settings, '_linkTarget', '_blank');

      if (!vm.model.settings._button) {
        vm.model.settings._button = vm.buttonStyles[0];
      } else {
        vm.urlValid = true;
        vm.validUrl = vm.model.settings._url;
      }

      SettingsModel.retrieveByKey('linkPattern').then(function (response) {
        vm.linkPattern = response;
      });
    }
  }

})(angular);
