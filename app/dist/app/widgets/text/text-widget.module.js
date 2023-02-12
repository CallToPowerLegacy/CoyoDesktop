(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.text', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerTextWidget);

  function registerTextWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'text',
      name: 'WIDGET.TEXT.NAME',
      description: 'WIDGET.TEXT.DESCRIPTION',
      icon: 'zmdi-format-align-left',
      categories: 'static',
      directive: 'coyo-text-widget'
    });
  }

})(angular);
