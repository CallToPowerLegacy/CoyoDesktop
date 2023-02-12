(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.downloads', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerDownloadsWidget);

  function registerDownloadsWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.DOWNLOADS.NAME',
      key: 'downloads',
      icon: 'zmdi-download',
      categories: 'static',
      directive: 'coyo-downloads-widget',
      description: 'WIDGETS.DOWNLOADS.DESCRIPTION',
      titles: ['WIDGETS.DOWNLOADS.NAME'],
      settings: {
        controller: 'DownloadsWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/downloads/downloads-widget-settings.html'
      }
    });
  }

})(angular);
