(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.widgets.video
   *
   * @description
   * # video Widget #
   * Show a video in a widget
   */
  angular
      .module('coyo.widgets.video', [
        'coyo.widgets.api',
        'commons.oembed',
        'commons.i18n'
      ])
      .config(registerVideoWidget);

  function registerVideoWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.VIDEO.NAME',
      key: 'video',
      description: 'WIDGETS.VIDEO.DESCRIPTION',
      icon: 'zmdi-youtube-play',
      categories: 'static',
      directive: 'coyo-video-widget',
      settings: {
        templateUrl: 'app/widgets/video/video-widget-settings.html',
        controller: 'VideoWidgetSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }
})(angular);
