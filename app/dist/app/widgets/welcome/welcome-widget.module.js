(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.welcome', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerWelcomeWidget);

  function registerWelcomeWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'welcome',
      name: 'WIDGET.WELCOME.NAME',
      description: 'WIDGET.WELCOME.DESCRIPTION',
      icon: 'zmdi-mood',
      categories: 'personal',
      directive: 'coyo-welcome-widget',
      settings: {
        templateUrl: 'app/widgets/welcome/welcome-widget-settings.html',
        controller: 'WelcomeWidgetSettingsController as $ctrl'
      },
      renderOptions: {
        panels: {
          noPanel: true
        }
      }
    });
  }

})(angular);
