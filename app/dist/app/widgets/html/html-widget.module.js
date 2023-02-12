(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.html', [
        'coyo.widgets.api',
        'commons.i18n',
        'ngSanitize'
      ])
      .config(registerhtmlWidget);

  function registerhtmlWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'html',
      name: 'WIDGET.HTML.NAME',
      description: 'WIDGET.HTML.DESCRIPTION',
      icon: 'zmdi-language-html5',
      categories: 'static',
      directive: 'coyo-html-widget',
      settings: {
        templateUrl: 'app/widgets/html/html-widget-settings.html'
      }
    });
  }

})(angular);
