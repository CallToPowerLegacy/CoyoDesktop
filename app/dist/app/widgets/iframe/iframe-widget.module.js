(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.widgets.iframe
   *
   * @description
   * # iFrame Widget #
   * Show a iFrame in a widget
   */
  angular
      .module('coyo.widgets.iframe', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerIframeWidget);

  function registerIframeWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGET.IFRAME.NAME',
      key: 'iframe',
      description: 'WIDGET.IFRAME.DESCRIPTION',
      icon: 'zmdi-picture-in-picture',
      categories: 'dynamic',
      directive: 'coyo-iframe-widget',
      settings: {
        templateUrl: 'app/widgets/iframe/iframe-widget-settings.html',
        controller: 'IframeWidgetSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }

})(angular);
