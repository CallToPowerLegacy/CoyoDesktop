(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.divider', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerDividerWidget);

  function registerDividerWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'divider',
      name: 'WIDGET.DIVIDER.NAME',
      description: 'WIDGET.DIVIDER.DESCRIPTION',
      icon: 'zmdi-power-input',
      categories: 'static',
      directive: 'coyo-divider-widget',
      settings: {
        templateUrl: 'app/widgets/divider/divider-widget-settings.html',
        skipOnCreate: true
      }
    });
  }

})(angular);
