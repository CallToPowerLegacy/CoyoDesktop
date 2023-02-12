(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.image', [
        'coyo.widgets.api',
        'coyo.apps.api',
        'coyo.domain',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerImageWidget);

  function registerImageWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'image',
      name: 'WIDGET.IMAGE.NAME',
      description: 'WIDGET.IMAGE.DESCRIPTION',
      icon: 'zmdi-image-o',
      categories: 'static',
      directive: 'coyo-image-widget',
      inlineOptions: {
        controller: 'ImageWidgetInlineOptionsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/image/image-widget-inline-options.html'
      }
    });
  }

})(angular);
