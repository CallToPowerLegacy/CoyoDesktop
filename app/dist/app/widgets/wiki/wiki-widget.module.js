(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wiki', [
        'coyo.widgets.api',
        'commons.resource',
        'commons.target',
        'commons.i18n'
      ])
      .config(registerWikiWidget);

  function registerWikiWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.WIKI.NAME',
      key: 'wiki',
      icon: 'zmdi-library',
      categories: 'dynamic',
      directive: 'coyo-wiki-widget',
      description: 'WIDGETS.WIKI.DESCRIPTION',
      titles: ['WIDGETS.WIKI.NAME'],
      settings: {
        controller: 'WikiWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/wiki/wiki-widget-settings.html'
      }
    });
  }

})(angular);
