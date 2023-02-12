(function (angular) {
  'use strict';

  angular
  /**
   * @ngdoc overview
   * @name coyo.widgets.rss
   *
   * @description
   * # RSS Widget #
   * Shows a rss feed with in a widget.
   */
      .module('coyo.widgets.rss', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerRssWidget);

  function registerRssWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'rss',
      name: 'WIDGET.RSS.NAME',
      description: 'WIDGET.RSS.DESCRIPTION',
      titles: ['WIDGET.RSS.NAME'],
      icon: 'zmdi-rss',
      categories: 'dynamic',
      directive: 'coyo-rss-widget',
      settings: {
        controller: 'RssWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/rss/rss-widget-settings.html'
      }
    });
  }
})(angular);
