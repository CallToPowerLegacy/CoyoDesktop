(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.teaser', ['coyo.widgets.api', 'commons.i18n'])
      .config(registerTeaserWidget);

  /**
   * @ngdoc overview
   * @name coyo.widgets.teaser
   *
   * @description
   * # Teaser widget #
   * Show teasers in a widget
   */
  function registerTeaserWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.TEASER.NAME',
      key: 'teaser',
      icon: 'zmdi-view-carousel',
      categories: 'static',
      directive: 'coyo-teaser-widget',
      description: 'WIDGETS.TEASER.DESCRIPTION',
      settings: {
        controller: 'TeaserWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/teaser/teaser-widget-settings.html'
      }
    });
  }
})(angular);
