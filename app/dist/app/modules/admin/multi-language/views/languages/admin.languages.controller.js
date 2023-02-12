(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.multiLanguage')
      .controller('AdminLanguagesController', AdminLanguagesController);

  function AdminLanguagesController($scope, $translate, languageModels, adminService, SettingsModel) {
    var vm = this;

    vm.$onInit = init;
    vm.toggleActive = toggleActive;

    function init() {
      vm.mobile = adminService.initMobileCheck($scope, function (mobile) {
        vm.mobile = mobile;
      });

      var translationPrefix = 'LANGUAGE.LANGUAGES.';
      vm.languages = languageModels.map(function (languageModel) {
        return {
          model: languageModel,
          name: $translate.instant(translationPrefix + languageModel.language)
        };
      });
    }

    function toggleActive(language) {
      language.toggleActive().then(function () {
        SettingsModel.retrieve(true); // reset settings cache to update available languages
        language.active = !language.active;
      });
    }
  }
})(angular);
