(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.content')
      .controller('ContentAppViewController', ContentAppViewController);

  /**
   * Controller for viewing a content app in multiple languages.
   *
   * @requires $stateParams
   * @requires $state
   * @requires app
   * @requires sender
   * @requires currentUser
   * @requires SettingsModel
   * @constructor
   */
  function ContentAppViewController($stateParams, $state, app, sender, currentUser, SettingsModel) {
    var vm = this;
    vm.$onInit = init;

    vm.app = app;
    vm.sender = sender;

    vm.buildLayoutName = buildLayoutName;

    function init() {
      if ($stateParams.created) {
        $state.go('.edit', {created: true});
      } else {
        var translations = vm.app.getTranslatedContent().concat(sender.defaultLanguage);
        currentUser.getBestSuitableLanguage(translations, SettingsModel.retrieve).then(function (language) {
          vm.currentLanguage = language;
        });
      }
    }

    function buildLayoutName() {
      var name = 'app-content-' + vm.app.id;
      if (!!vm.currentLanguage && !!sender.defaultLanguage && vm.currentLanguage !== 'NONE'
          && sender.defaultLanguage !== vm.currentLanguage) {
        name += '-' + vm.currentLanguage;
      }
      return name;
    }
  }

})(angular);
