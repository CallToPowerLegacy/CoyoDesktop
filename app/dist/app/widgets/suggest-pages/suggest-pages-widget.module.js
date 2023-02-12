(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.suggestpages', [
        'coyo.widgets.api',
        'commons.resource',
        'commons.i18n'
      ])
      .config(registerPageWidget);

  function registerPageWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.SUGGEST_PAGES.NAME',
      key: 'suggestpages',
      icon: 'zmdi-layers',
      categories: 'dynamic',
      directive: 'coyo-suggest-pages-widget',
      description: 'WIDGETS.SUGGEST_PAGES.DESCRIPTION',
      titles: ['WIDGETS.SUGGEST_PAGES.NAME'],
      settings: {
        controller: 'SuggestPagesWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/suggest-pages/suggest-pages-widget-settings.html'
      }
    });
  }

})(angular);
