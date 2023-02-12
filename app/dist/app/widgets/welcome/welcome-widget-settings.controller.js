(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.welcome')
      .controller('WelcomeWidgetSettingsController', WelcomeWidgetSettingsController);

  function WelcomeWidgetSettingsController($scope, $translate) {
    var settings = $scope.model.settings;

    $translate('WIDGET.WELCOME.TEXT').then(function (translation) {
      settings.welcomeText = settings.welcomeText || translation;
    });
  }

})(angular);
