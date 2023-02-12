(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rss')
      .controller('RssWidgetSettingsController', RssWidgetSettingsController);

  function RssWidgetSettingsController($scope, RssWidgetModel) {
    var vm = this;
    vm.verifyUrl = verifyUrl;
    vm.$onInit = onInit;

    function verifyUrl() {
      if (vm.loading) {
        return;
      }
      vm.valid = undefined;
      vm.validationMessage = 'loading';
      vm.loading = true;

      RssWidgetModel.verifyUrl(vm.model.settings.rssUrl, vm.model.settings.userName,
          vm.model.settings._encrypted_password)
          .then(handleVerification).finally(function () {
            vm.loading = false;
          });

      function handleVerification(verified) {
        vm.valid = verified.valid;
        vm.validationMessage = verified.validationMessage;

        if (!verified.valid && verified.validationMessage === 'unauthorized' && vm.unauthorized === true) {
          vm.validationMessage = 'invalidCredentials';
        } else if (!verified.valid && verified.validationMessage === 'unauthorized') {
          vm.unauthorized = true;
        }
      }
    }

    function onInit() {
      vm.tab = 1;
      vm.valid = true;
      vm.model = $scope.model;

      if (!vm.model.settings.maxCount && !vm.model.settings.displayImage) {
        $scope.model.settings.displayImage = true;
        $scope.model.settings.maxCount = 5;
      }
    }
  }
})(angular);
