(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.code', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerCodeWidget);

  function registerCodeWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'code',
      name: 'WIDGET.CODE.NAME',
      description: 'WIDGET.CODE.DESCRIPTION',
      icon: 'zmdi-code',
      categories: 'dynamic',
      directive: 'coyo-code-widget',
      titles: ['WIDGET.CODE.TITLE'],
      settings: {
        templateUrl: 'app/widgets/code/code-settings.html',
        controller: 'CodeWidgetSettingsController',
        controllerAs: '$ctrl',
      }
    });
  }

})(angular);
