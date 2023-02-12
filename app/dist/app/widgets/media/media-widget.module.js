(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media', [
        'coyo.widgets.api',
        'commons.i18n',
        'commons.ui',
        'commons.resource'
      ])
      .config(registerMediaWidget);

  function registerMediaWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'media',
      name: 'WIDGET.MEDIA.NAME',
      description: 'WIDGET.MEDIA.DESCRIPTION',
      icon: 'zmdi-collection-image-o',
      categories: 'static',
      directive: 'coyo-media-widget',
      settings: {
        controller: 'MediaWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/media/media-widget-settings.html'
      }
    });
  }

})(angular);
